use std::sync::Mutex;

use tauri::{Emitter, Manager, WindowEvent};
use tauri_plugin_sql::{Migration, MigrationKind};

mod fetch_website_content;
mod file_change_watcher;
mod config_path;
mod config;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_url(url: &str) -> bool {
    match opener::open(url) {
        Ok(()) => true,
        Err(_) => false,
    }
}

#[tauri::command]
fn get_config() -> config::Config {
    config::read_config()
}

fn migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create initial tables",
        sql: "
            create table if not exists bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text,
                url text,
                description text,
                tag_count int not null
            );

            create table if not exists tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text unique
            );

            create table if not exists tag_map (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bkmk_id int,
                tag_id int,
                FOREIGN KEY (bkmk_id) REFERENCES bookmarks (id),
                FOREIGN KEY (tag_id) REFERENCES tags (id)
            );
            ",
        kind: MigrationKind::Up,
    }]
}

fn start_file_change_watcher(
    app: &mut tauri::App
) -> Option<file_change_watcher::FileChangeWatcher> {
    let mut f_watcher = file_change_watcher::FileChangeWatcher::new();

    let Ok(file_path) = config_path::config_file_path() else {
        return None;
    };
    let app_ = app.handle().clone();
    let result = f_watcher.spawn(file_path, move || {
        let _ = app_.emit("change-config-file", ());
    });
    
    if result.is_err() {
        return None;
    }
    
    Some(f_watcher)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        //.plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:skin.db", migrations())
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_url,
            get_config,
            fetch_website_content::fetch_website_content
        ])
        .setup(|app| {
            // 開発時だけdevtoolsを表示する。
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();

            let f_watcher = start_file_change_watcher(app);
            app.manage(Mutex::new(f_watcher));
            
            Ok(())
        })
        .on_window_event(|window,event| match event {
            WindowEvent::Destroyed => {
                let f_watcher = window.state::<Mutex<Option<file_change_watcher::FileChangeWatcher>>>();
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