use std::fs::create_dir_all;
use std::path::PathBuf;

use sqlx::migrate::MigrateDatabase;
use sqlx::{Sqlite, SqlitePool};

mod migrations;
pub mod commands;
pub mod models;
mod error;

pub type DbPool = SqlitePool;

pub async fn connect(dir_path: PathBuf) -> Result<DbPool, sqlx::Error> {
    create_dir_all(&dir_path).expect("Couldn't create app config dir");
    let db_url = path_mapper(dir_path, "sqlite:database.sqlite");
    if !Sqlite::database_exists(&db_url).await.unwrap_or(false) {
        Sqlite::create_database(&db_url).await?;
    };
    let con = SqlitePool::connect(&db_url).await?;
    let mig = migrations::migrator().await?;
    mig.run(&con).await?;
    
    Ok(con)
}

/// Maps the user supplied DB connection string to a connection string
/// with a fully qualified file path to the App's designed "app_path"
fn path_mapper(mut app_path: std::path::PathBuf, connection_string: &str) -> String {
    app_path.push(
        connection_string
            .split_once(':')
            .expect("Couldn't parse the connection string for DB!")
            .1,
    );

    format!(
        "sqlite:{}",
        app_path
            .to_str()
            .expect("Problem creating fully qualified path to Database file!")
    )
}


// #[cfg(test)]
// mod tests;

#[cfg(test)]
mod test_test;