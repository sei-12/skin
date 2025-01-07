use sqlx::prelude::FromRow;
use tauri::{command, State};

use super::{models::TagRecord, DbPool};
use crate::db::error::CommandError;

#[command]
pub async fn is_exists_tag<'a>(
    pool: State<'a, DbPool>,
    tag: String
) -> Result<bool, CommandError> {
    let result= sqlx::query("select * from tags where name = $1")
        .bind(tag)
        .fetch_optional(pool.inner())
        .await?;

    Ok(result.is_some())
}

// #[command]
// pub async fn insert_sample<'a>(
//     pool: State<'a, DbPool>,
//     req: RequestInsertSample,
// ) -> Result<(), CommandError> {
//     sqlx::query("insert into samples values(null,?)")
//         .bind(req.content)
//         .execute(pool.inner())
//         .await?;

//     Ok(())
// }

// #[derive(serde::Serialize, serde::Deserialize, FromRow, Debug, PartialEq)]
// pub struct Sample {
//     pub id: i64,
//     pub content: String,
// }

// #[command]
// pub async fn fetch_samples<'a>(
//     pool: State<'a, DbPool>,
// ) -> Result<Vec<Sample>, CommandError> {
//     let result: Vec<Sample> = sqlx::query_as("select * from samples")
//         .fetch_all(pool.inner())
//         .await?;

//     Ok(result)
// }