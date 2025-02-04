fn macos_config_file_path() -> Result<String, Box<dyn std::error::Error>> {
    use homedir::my_home;
    let Some(home_dir) = my_home()? else {
        return Err("Could not find home directory".into());
    };

    let Some(home_dir_str) = home_dir.to_str() else {
        return Err("Could not convert home directory to string".into());
    };

    Ok(format!("{}/.config/skin/config.json", home_dir_str))
}

// #[cfg(target_os="linux")]
fn linux_config_file_path() -> Result<String, Box<dyn std::error::Error>> {
    use homedir::my_home;
    let Some(home_dir) = my_home()? else {
        return Err("Could not find home directory".into());
    };

    let Some(home_dir_str) = home_dir.to_str() else {
        return Err("Could not convert home directory to string".into());
    };

    Ok(format!("{}/.config/skin/config.json", home_dir_str))
}

// windowsについて詳しくない
// このフォルダが適切なのかわからない
fn windows_config_file_path() -> Result<String, Box<dyn std::error::Error>> {
    use std::env;

    let home_dir =
        env::var("USERPROFILE").map_err(|_| "Could not find USERPROFILE environment variable")?;

    Ok(format!(r"{}\AppData\Roaming\skin\config.json", home_dir))
}

pub(super) fn config_file_path() -> Result<String, Box<dyn std::error::Error>> {
    match std::env::consts::OS {
        "macos" => macos_config_file_path(),
        "linux" => linux_config_file_path(),
        "windows" => windows_config_file_path(),
        _ => Err("Unsupported OS".into()),
    }
}

