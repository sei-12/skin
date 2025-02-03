use std::collections::HashSet;

use futures::future::join_all;
// use futures_core::
use tauri::{command, State};

use super::{
    models::{Bookmark, BookmarkRecord, InsertBookmarkRequest, TagRecord},
    DbPool,
};
use crate::db::error::CommandError;

#[command]
pub async fn delete_bookmark(
    pool: State<'_, DbPool>,
    bookmark_id: i64,
) -> Result<(), CommandError> {
    sqlx::query(
        "
        delete from tag_map where bkmk_id = $1;
        delete from bookmarks where id = $1;",
    )
    .bind(bookmark_id)
    .execute(pool.inner())
    .await?;

    Ok(())
}

#[command]
pub async fn is_exists_tag(pool: State<'_, DbPool>, tag: String) -> Result<bool, CommandError> {
    let result = sqlx::query("select * from tags where name = $1")
        .bind(tag)
        .fetch_optional(pool.inner())
        .await?;

    Ok(result.is_some())
}

// 順番が変わらない
#[command]
pub async fn insert_bookmark(
    pool: State<'_, DbPool>,
    req: InsertBookmarkRequest,
) -> Result<(), CommandError> {
    // remoe duplicate tag
    let tags: Vec<String> = filter_duplicate(req.tags);

    let Ok(tag_count) = u32::try_from(tags.len()) else {
        return Err(CommandError::BadRequest);
    };

    if tag_count == 0 {
        return Err(CommandError::Validation);
    };
    if req.title.is_empty() {
        return Err(CommandError::Validation);
    };
    if req.url.is_empty() {
        return Err(CommandError::Validation);
    };

    insert_tags_if_not_exists(&pool, &tags).await?;

    let result = sqlx::query("insert into bookmarks values (null,$1,$2,$3,$4);")
        .bind(req.title)
        .bind(req.url)
        .bind(req.desc)
        .bind(tag_count)
        .execute(pool.inner())
        .await?;

    mapping_tags(&pool, result.last_insert_rowid(), &tags).await?;

    Ok(())
}

#[command]
pub async fn find_tag(
    pool: State<'_, DbPool>,
    predicate: String,
) -> Result<Vec<String>, CommandError> {
    if predicate.is_empty() {
        return Ok(vec![]);
    };

    let mut result1: Vec<TagRecord> =
        sqlx::query_as(" select * from tags where name like $1 order by length(name), name")
            .bind(format!("{}%", predicate))
            .fetch_all(pool.inner())
            .await?;
    let mut result2: Vec<TagRecord> = sqlx::query_as(
        "select * from tags where name like $2 and name not like $1 order by length(name), name",
    )
    .bind(format!("{}%", predicate))
    .bind(format!("%{}%", predicate))
    .fetch_all(pool.inner())
    .await?;

    result1.append(&mut result2);

    Ok(result1.into_iter().map(|e| e.name).collect())
}

#[command]
pub async fn find_bookmark(
    pool: State<'_, DbPool>,
    filter_tags: Vec<String>,
) -> Result<Vec<Bookmark>, CommandError> {
    let filter_tags = filter_duplicate(filter_tags);

    let q = build_query_find_bookmark(&filter_tags);
    let mut query = sqlx::query_as(&q);
    for tag in filter_tags {
        query = query.bind(tag);
    }
    let records: Vec<BookmarkRecord> = query.fetch_all(pool.inner()).await?;

    let select_process = records
        .into_iter()
        .map(|r| async { select_tags_where_bookmark(&pool, r).await });

    let bookmarks = join_all(select_process).await;

    vec_result_to_result_vec(bookmarks)
}

#[command]
pub async fn fetch_bookmarks(
    pool: State<'_, DbPool>,
    max_length: i64,
) -> Result<Vec<Bookmark>, CommandError> {
    // IDはAUTOINCREMENTであることが保証されている
    let records: Vec<BookmarkRecord> =
        sqlx::query_as("select * from bookmarks order by id desc limit $1 ;")
            .bind(max_length)
            .fetch_all(pool.inner())
            .await?;

    let select_process = records
        .into_iter()
        .map(|r| async { select_tags_where_bookmark(&pool, r).await });

    let bookmarks = join_all(select_process).await;

    vec_result_to_result_vec(bookmarks)
}

#[derive(sqlx::FromRow)]
struct SelectTagsRecord {
    tag_name: String,
}

async fn select_tags_where_bookmark(
    pool: &State<'_, DbPool>,
    record: BookmarkRecord,
) -> Result<Bookmark, CommandError> {
    let result: Vec<SelectTagsRecord> = sqlx::query_as(
        "
        SELECT tags.name as tag_name
        FROM tags
        JOIN tag_map ON tags.id = tag_map.tag_id
        WHERE tag_map.bkmk_id = $1;",
    )
    .bind(record.id)
    .fetch_all(pool.inner())
    .await?;

    Ok(Bookmark {
        id: record.id,
        title: record.title,
        url: record.url,
        desc: record.description,
        tags: result.into_iter().map(|r| r.tag_name).collect(),
    })
}

fn build_query_find_bookmark(tags: &[String]) -> String {
    let mut names = String::new();
    for i in 1..tags.len() + 1 {
        names.push_str(&format!("${},", i));
    }
    names.pop();

    let query = format!(
        "
    SELECT b.*
    FROM bookmarks b
    JOIN tag_map tm ON b.id = tm.bkmk_id
    JOIN tags t ON tm.tag_id = t.id
    WHERE t.name IN ({})
    GROUP BY b.id
    HAVING COUNT(DISTINCT t.name) = {}
    ORDER BY b.tag_count ASC;
    ",
        names,
        tags.len()
    );

    query
}

pub(super) async fn mapping_tags(
    pool: &State<'_, DbPool>,
    bookmark_id: i64,
    tags: &Vec<String>,
) -> Result<(), CommandError> {
    let mut q = "
    insert into tag_map (bkmk_id,tag_id)
        values
    "
    .to_string();

    for i in 2..tags.len() + 2 {
        q.push_str(&format!("($1,(select id from tags where name = ${})),", i));
    }
    q.pop();
    q.push(';');

    let mut query = sqlx::query(&q);
    query = query.bind(bookmark_id);

    for tag in tags {
        query = query.bind(tag);
    }

    query.execute(pool.inner()).await?;

    Ok(())
}

pub(super) async fn insert_tags_if_not_exists(
    pool: &State<'_, DbPool>,
    tags: &Vec<String>,
) -> Result<(), CommandError> {
    let q = build_query_insert_tags_if_not_exists(tags.len());
    let mut query = sqlx::query(&q);

    for tag in tags {
        tag_validation_check(tag)?;
        query = query.bind(tag);
    }

    query.execute(pool.inner()).await?;

    Ok(())
}

fn tag_validation_check(tag: &str) -> Result<(), CommandError> {
    if tag.is_empty() {
        return Err(CommandError::Validation);
    };

    if tag.contains(" ") {
        return Err(CommandError::Validation);
    };

    Ok(())
}

fn build_query_insert_tags_if_not_exists(tags_count: usize) -> String {
    let mut query = "insert or ignore into tags (id,name) values ".to_string();

    for i in 1..tags_count + 1 {
        query.push_str(&format!("(null,${}),", i));
    }

    // ,を削除
    // もっといい方法があると思う
    query.pop();

    query.push(';');

    query
}

// https://davirain.xlog.page/Convert-VecResultT-E-to-ResultVecT-E?locale=ja
fn vec_result_to_result_vec<T, E>(v: Vec<Result<T, E>>) -> Result<Vec<T>, E> {
    v.into_iter()
        .try_fold(Vec::new(), |mut acc, res| match res {
            Ok(t) => {
                acc.push(t);
                Ok(acc)
            }
            Err(e) => Err(e),
        })
}

fn filter_duplicate(v: Vec<String>) -> Vec<String> {
    let mut ret_vec: Vec<String> = Vec::with_capacity(v.len());
    let mut s: HashSet<String> = HashSet::new();

    for string in v.into_iter() {
        if s.contains(&string) {
            continue;
        }
        s.insert(string.clone());
        ret_vec.push(string);
    }

    drop(s);

    ret_vec
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filter_duplicate() {
        let a = vec![
            "hello".to_string(),
            "hello".to_string(),
            "hello1".to_string(),
            "hello1".to_string(),
        ];
        assert_eq!(
            filter_duplicate(a),
            vec!["hello".to_string(), "hello1".to_string(),]
        )
    }
}
