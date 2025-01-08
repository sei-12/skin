use std::result;

use sqlx::{prelude::FromRow, query, Execute, QueryBuilder, Sqlite};
use tauri::{command, State};

use super::{
    models::{InsertBookmarkRequest, TagRecord},
    DbPool,
};
use crate::db::error::CommandError;

#[command]
pub async fn is_exists_tag<'a>(pool: State<'a, DbPool>, tag: String) -> Result<bool, CommandError> {
    let result = sqlx::query("select * from tags where name = $1")
        .bind(tag)
        .fetch_optional(pool.inner())
        .await?;

    Ok(result.is_some())
}

#[command]
pub async fn insert_bookmark<'a>(
    pool: State<'a, DbPool>,
    req: InsertBookmarkRequest,
) -> Result<(), CommandError> {
    let Ok(tag_count) = u32::try_from(req.tags.len()) else {
        return Err(CommandError::BadRequest);
    };

    if tag_count == 0 {
        return Err(CommandError::Validation);
    };
    if req.title == "" {
        return Err(CommandError::Validation);
    };
    if req.url == "" {
        return Err(CommandError::Validation);
    };

    insert_tags_if_not_exists(&pool, &req.tags).await?;

    let result = sqlx::query("insert into bookmarks values (null,$1,$2,$3,$4);")
        .bind(req.title)
        .bind(req.url)
        .bind(req.description)
        .bind(tag_count)
        .execute(pool.inner())
        .await?;

    mapping_tags(&pool, result.last_insert_rowid(), &req.tags).await?;

    Ok(())
}

#[command]
pub async fn find_tag<'a>(
    pool: State<'a, DbPool>,
    predicate: String,
) -> Result<Vec<String>, CommandError> {
    if predicate == "" {
        return Ok(vec![]);
    };

    let result: Vec<TagRecord> = sqlx::query_as(
        "
        select * from (select * from tags order by length(name)) where name like $1
        union
        select * from (select * from tags order by length(name)) where name like $2 and name not like $1
        ",
    )
    .bind(format!("{}%", predicate))
    .bind(format!("%{}%", predicate))
    .fetch_all(pool.inner())
    .await?;

    Ok(result.into_iter().map(|e| e.name).collect())
}

pub(super) async fn mapping_tags<'a>(
    pool: &State<'a, DbPool>,
    bookmark_id: i64,
    tags: &Vec<String>,
) -> Result<(), CommandError> {
    let mut q = "
    insert into tag_map (bkmk_id,tag_id)
        values
    "
    .to_string();

    for i in 2..tags.len() + 2 {
        q.push_str(&format!(
            "($1,(select id from tags where name = ${})),",
            i.to_string()
        ));
    }
    q.pop();
    q.push_str(";");

    let mut query = sqlx::query(&q);
    query = query.bind(bookmark_id);

    for tag in tags {
        query = query.bind(tag);
    }

    query.execute(pool.inner()).await?;

    Ok(())
}

pub(super) async fn insert_tags_if_not_exists<'a>(
    pool: &State<'a, DbPool>,
    tags: &Vec<String>,
) -> Result<(), CommandError> {
    let q = build_query_insert_tags_if_not_exists(tags.len());
    let mut query = sqlx::query(&q);

    for tag in tags {
        query = query.bind(tag);
    }

    query.execute(pool.inner()).await?;

    Ok(())
}

fn build_query_insert_tags_if_not_exists(tags_count: usize) -> String {
    let mut query = format!("insert or ignore into tags (id,name) values ");

    for i in 1..tags_count + 1 {
        query.push_str(&format!("(null,${}),", i.to_string()));
    }

    // ,を削除
    // もっといい方法があると思う
    query.pop();

    query.push_str(";");

    query
}
