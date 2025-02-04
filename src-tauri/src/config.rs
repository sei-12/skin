use std::path::PathBuf;

use crate::config_model::Config;

fn default_config() -> Config {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

pub fn read_or_default_config(
    mut app_config_path: PathBuf
) -> Config {

    app_config_path.push("config.json");
    let Ok(config_str) = std::fs::read_to_string(&app_config_path) else {
        return default_config();
    };

    let Ok(config) = serde_json::from_str(&config_str) else {
        return default_config();
    };

    config
}

pub fn if_not_exists_write_default_config(
    mut app_config_path: PathBuf,
) -> Result<(), std::io::Error> {
    app_config_path.push("config.json");

    if std::fs::exists(&app_config_path)? {
        return Ok(());
    }

    let contents =
        serde_json::to_string(&default_config()).expect("Failed to parse default config");

    std::fs::write(app_config_path, contents)?;

    Ok(())
}
