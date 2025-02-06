use std::fs::create_dir_all;
use std::path::PathBuf;

use sqlx::migrate::MigrateDatabase;
use sqlx::{Sqlite, SqlitePool};

pub mod commands;
mod fuzzy_find_tag;
mod error;
mod migrations;
pub mod models;

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

#[cfg(test)]
#[cfg(not(target_os = "windows"))]
mod tests;
// #[cfg(not(target_os = "windows"))] について
// tauri::test::mock_appを使用すると以下のようなエラーが出てテストを実行できない
// process didn't exit successfully: `D:\a\skin\skin\src-tauri\target\debug\deps\skin_lib-1f62670fd56f937a.exe` (exit code: 0xc0000139, STATUS_ENTRYPOINT_NOT_FOUND)
//
// tauri::testはunstableらしい
// https://docs.rs/tauri/latest/tauri/test/index.html
//
// コマンド(#[tauri::command]のこと)がState<DbPool>を受け取るため、テストするにはtauri::test::mock_appが必要(https://github.com/tauri-apps/tauri/discussions/11717)
// コマンドを内部の関数を呼び出すだけの薄い設計にすればテストをかけると思う
// 例：
// ```rust
// #[command]
// pub async fn foo<'a>(pool: State<'a, DbPool>,) -> Result<(), CommandError> {
//     inner_foo(pool.inner()).await?;
// }
// pub async fn inner_foo(pool: DbPool) -> Result<(), CommandError> {
//     ...
// }
// ```
// めんどくさいので今はやらない
