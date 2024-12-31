use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};
mod fetch_website_content;

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
            fetch_website_content::fetch_website_content
        ])
        .setup(|_app| {
            // 開発時だけdevtoolsを表示する。
            #[cfg(debug_assertions)]
            _app.get_webview_window("main").unwrap().open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
