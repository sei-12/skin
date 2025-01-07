use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use ts_rs::TS;


#[derive(Serialize, Deserialize, TS, FromRow, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct BookmarkRecord {
    id: i64,
    title: String,
    url: String,
    description: String,
    tag_count: i32,
}


#[derive(Serialize, Deserialize, TS, FromRow, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct TagRecord {
    id: i64,
    name: String,
}
