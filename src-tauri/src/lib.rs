use std::sync::Mutex;

use chrono::Utc;
use tauri::{async_runtime::block_on, AppHandle, Emitter, Listener, Manager, State, WindowEvent};

mod config;
mod config_path;
mod db;
mod fetch_website_content;
mod file_change_watcher;

mod config_model;

#[tauri::command]
fn open_url(url: &str) -> bool {
    match opener::open(url) {
        Ok(()) => true,
        Err(_) => false,
    }
}

#[tauri::command]
fn get_config<'a>(
    config: State<'a, Mutex<config_model::Config>>,
) -> Result<config_model::Config, ()> {
    let Ok(locked) = config.lock() else {
        return Err(());
    };

    // もっといい方法がある気がする
    Ok(locked.clone())
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

fn start_file_change_watcher(
    app: &mut tauri::App,
) -> Option<file_change_watcher::FileChangeWatcher> {
    let mut f_watcher = file_change_watcher::FileChangeWatcher::new();

    let Ok(file_path) = config_path::config_file_path() else {
        return None;
    };
    let app_ = app.handle().clone();

    let result = f_watcher.spawn(file_path, move || {
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

        let new_config = config::read_config();

        let config_mutex = app_.state::<Mutex<config_model::Config>>();
        let Ok(mut config) = config_mutex.lock() else {
            return;
        };
        *config = new_config;
        drop(config);

        let _ = app_.emit("change-config-file", ());
    });

    if result.is_err() {
        return None;
    }

    Some(f_watcher)
}

#[cfg(not(feature = "dev_disable_hide_on_blur"))]
fn enable_hide_on_blur(app_handle: &AppHandle) {
    let Some(window) = app_handle.get_webview_window("main") else {
        return ();
    };

    let app_handle_ = app_handle.clone();

    window.listen("tauri://blur", move |_| {
        let Some(window) = app_handle_.get_webview_window("main") else {
            return ();
        };
        let _ = window.hide();
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_, _, _| {}))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            open_url,
            get_config,
            fetch_website_content::fetch_website_content,
            db::commands::insert_bookmark,
            db::commands::delete_bookmark,
            db::commands::is_exists_tag,
            db::commands::find_tag,
            db::commands::find_bookmark,
        ])
        .setup(|app| {
            let main_window = app.get_webview_window("main").expect("err get main window");
            main_window.set_visible_on_all_workspaces(true)?;

            app.manage(Mutex::new(config::read_config()));

            // 開発時だけdevtoolsを表示する。
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();

            app.manage(Mutex::new(ConfigFileChangeEmitTime::new()));
            let f_watcher = start_file_change_watcher(app);
            app.manage(Mutex::new(f_watcher));

            // フォーカスを外したらウィンドウを非表示にする機能は開発時にはあまりにも邪魔
            #[cfg(not(feature = "dev_disable_hide_on_blur"))]
            enable_hide_on_blur(app.handle());

            block_on(async {
                let path = app.path().app_data_dir()?;
                let pool = db::connect(path).await?;
                app.manage(pool);
                Ok(())
            })
        })
        .on_window_event(|window, event| match event {
            WindowEvent::Destroyed => {
                let f_watcher =
                    window.state::<Mutex<Option<file_change_watcher::FileChangeWatcher>>>();
                let Ok(mut locked) = f_watcher.lock() else {
                    return;
                };
                let f_watcher = locked.take();
                let Some(mut f_watcher) = f_watcher else {
                    return;
                };
                let _ = f_watcher.despawn();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
