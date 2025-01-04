use serde::{Deserialize, Serialize};

use crate::config_path;

#[derive(Serialize, Deserialize)]
pub struct Config {
    #[serde(default = "config_defalt_bg_color")]
    bg_color: String,
}

fn config_defalt_bg_color() -> String {
    "white".to_string()
}

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



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_default_bg_color() {
        assert_eq!(config_defalt_bg_color(), "white");
    }

    #[test]
    fn test_default_config() {
        let config = default_config();
        assert_eq!(config.bg_color, "white");
    }
}