use std::{
    fs::{self, read_to_string},
    path::PathBuf,
    sync::Mutex,
};

use anyhow::Result;
use chrono::Utc;
use tauri::{Emitter, Manager};

use crate::file_change_watcher::FileChangeWatcher;

pub struct ConfigManger<T>
where
    T: serde::Serialize
        + serde::de::DeserializeOwned
        + std::marker::Sync
        + std::marker::Send
        + 'static,
{
    config_file_path: PathBuf,
    config: Mutex<T>,
    watcher: Mutex<FileChangeWatcher>,
}

impl<T> ConfigManger<T>
where
    T: serde::Serialize
        + serde::de::DeserializeOwned
        + Clone
        + std::marker::Sync
        + std::marker::Send
        + 'static,
{
    pub fn setup(app: &mut tauri::App, file_name: &str) -> Result<Self> {
        let config_dir = app.path().app_config_dir()?;
        let _ = fs::create_dir_all(&config_dir);

        let config_file_path = config_dir.join(file_name);

        if !config_file_path.exists() {
            todo!();
        }

        let config = Self::read_file(&config_file_path).expect("todo");
        let config = Mutex::new(config);

        let watcher = Self::start_file_watch(app, &config_file_path)?;
        let watcher = Mutex::new(watcher);

        app.manage(Mutex::new(ConfigFileChangeEmitTime::new()));

        Ok(Self {
            config_file_path,
            config,
            watcher,
        })
    }

    pub fn finalize(&self) {
        let Ok(mut f_watcher) = self.watcher.lock() else {
            return;
        };
        let _ = f_watcher.despawn();
    }

    fn read_file(path: impl AsRef<std::path::Path>) -> Result<T> {
        let contents = read_to_string(path)?;
        let config = serde_json::from_str(&contents)?;
        Ok(config)
    }

    pub fn get(&self) -> T {
        let c = self.config.lock().expect("todo");
        c.clone()
    }

    fn start_file_watch(
        app: &mut tauri::App,
        path: impl AsRef<std::path::Path>,
    ) -> Result<FileChangeWatcher> {
        let mut f_watcher = FileChangeWatcher::new();
        let app_ = app.handle().clone();

        let config_file_path = path.as_ref().as_os_str().to_str().unwrap().to_string();

        let _ = f_watcher.spawn(config_file_path, move || {
            // 一度eventをemitしたら{min_interval_ms}ミリ秒間はeventをemitしない
            let min_interval_ms = 1000;

            let prev_time = app_.state::<Mutex<ConfigFileChangeEmitTime>>();

            let Ok(mut prev_time) = prev_time.lock() else {
                return;
            };

            let diff = prev_time.calc_diff();

            if min_interval_ms > diff {
                return;
            };

            prev_time.update();
            drop(prev_time);

            let conf = app_.state::<ConfigManger<T>>();

            let new_config = Self::read_file(&conf.config_file_path).expect("todo impl default");

            let Ok(mut config) = conf.config.lock() else {
                return;
            };
            *config = new_config;
            drop(config);

            let _ = app_.emit("change-config-file", ());
        });

        Ok(f_watcher)
    }
}

struct ConfigFileChangeEmitTime {
    prev_time: i64,
}

impl ConfigFileChangeEmitTime {
    fn new() -> Self {
        ConfigFileChangeEmitTime { prev_time: 0 }
    }

    fn calc_diff(&self) -> i64 {
        let now = Utc::now().timestamp_millis();
        now - self.prev_time
    }

    fn update(&mut self) {
        let now = Utc::now().timestamp_millis();
        self.prev_time = now;
    }
}
