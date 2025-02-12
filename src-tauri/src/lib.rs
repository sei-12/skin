use config::ConfigManger;
use tauri::{async_runtime::block_on, AppHandle, Listener, Manager, State, WindowEvent};

mod config;
// mod config_path;
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
fn get_config(
    config: State<'_, ConfigManger<config_model::Config>>,
) -> Result<config_model::Config, ()> {
    let conf = config.inner();

    Ok(conf.get())
}

#[cfg(not(feature = "dev_disable_hide_on_blur"))]
fn enable_hide_on_blur(app_handle: &AppHandle) {
    let Some(window) = app_handle.get_webview_window("main") else {
        return;
    };

    let app_handle_ = app_handle.clone();

    window.listen("tauri://blur", move |_| {
        let Some(window) = app_handle_.get_webview_window("main") else {
            return;
        };
        let _ = window.hide();
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
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
            db::commands::fetch_bookmarks,
            db::commands::edit_bookmark,
            db::commands::get_bookmark,
            db::commands::fuzzy_find_tag,
            db::commands::fetch_tags,
            db::commands::edit_tag,
        ])
        .setup(|app| {
            // if_not_exists_write_default_config(app.path().app_config_dir().unwrap()).unwrap();

            {
                use tauri_plugin_autostart::MacosLauncher;
                use tauri_plugin_autostart::ManagerExt;

                let _ = app.handle().plugin(tauri_plugin_autostart::init(
                    MacosLauncher::LaunchAgent,
                    Some(vec![]),
                ));

                // Get the autostart manager
                let autostart_manager = app.autolaunch();
                // Enable autostart
                let _ = autostart_manager.enable();
                // Check enable state
                println!(
                    "registered for autostart? {}",
                    autostart_manager.is_enabled().unwrap()
                );
                // Disable autostart
                // let _ = autostart_manager.disable();
            }

            let config_manager = ConfigManger::<config_model::Config>::setup(app, "config.json")?;
            app.manage(config_manager);

            let main_window = app.get_webview_window("main").expect("err get main window");
            main_window.set_visible_on_all_workspaces(true)?;

            // 開発時だけdevtoolsを表示する。
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();

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
        .on_window_event(|window, event| {
            if let WindowEvent::Destroyed = event {
                let config_manager = window.state::<ConfigManger<config_model::Config>>();
                config_manager.finalize();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
