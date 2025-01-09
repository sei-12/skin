use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{Code, Modifiers, ShortcutState};

enum ToggleWindowErr {
    WindowNotFound,
    TauriErr,    
}
impl From<tauri::Error> for ToggleWindowErr {
    fn from(_: tauri::Error) -> Self {
        ToggleWindowErr::TauriErr
    }
}

fn toggle_window_visible(app_handle: &AppHandle) -> Result<(), ToggleWindowErr> {
    let Some(window) = app_handle.get_webview_window("main") else {
        return Err(ToggleWindowErr::WindowNotFound);
    };

    let is_visible = window.is_visible()?;

    if is_visible {
        window.hide()?;
    } else {
        window.show()?;
        window.set_focus()?;
    };

    Ok(())
}

pub fn set_global_hotkeys(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    app_handle.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            // TODO
            .with_shortcuts(["alt+z"])?
            .with_handler(|app, shortcut, event| {
                if event.state == ShortcutState::Released {
                    return;
                };

                if shortcut.matches(Modifiers::ALT, Code::KeyZ) {
                    let _ = toggle_window_visible(app);
                }
            })
            .build(),
    )?;

    Ok(())
}
