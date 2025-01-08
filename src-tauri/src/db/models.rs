use serde::{Deserialize, Serialize};
use ts_rs::TS;


#[derive(Serialize, Deserialize, TS, sqlx::FromRow, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct BookmarkRecord {
    pub id: u32,
    pub title: String,
    pub url: String,
    pub description: String,
    pub tag_count: i32,
}


#[derive(Serialize, Deserialize, TS, sqlx::FromRow, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct TagRecord {
    pub id: i64,
    pub name: String,
}



#[derive(Serialize, Deserialize, TS, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct InsertBookmarkRequest {
    pub title: String,
    pub url: String,
    pub desc: String,
    pub tags: Vec<String>,
}


#[derive(Serialize, Deserialize, TS, PartialEq, Debug)]
#[ts(export, export_to = "export/DbModels.d.ts")]
pub struct Bookmark {
    pub id: u32,
    pub title: String,
    pub url: String,
    pub desc: String,
    pub tags: Vec<String>,
}