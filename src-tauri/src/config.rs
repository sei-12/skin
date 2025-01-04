use crate::{config_model::Config, config_path};

fn default_config() -> Config {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

pub fn read_config() -> Config {
    let Ok(config_path) = config_path::config_file_path() else {
        return default_config();
    };
    
    let Ok(config_str) = std::fs::read_to_string(config_path) else {
        return default_config();
    };
    
    let Ok(config) = serde_json::from_str(&config_str) else {
        return default_config();
    };
    
    config
}
