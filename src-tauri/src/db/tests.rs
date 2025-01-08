use std::{env::temp_dir, path::PathBuf};

use tauri::Manager;
use uuid::Uuid;

use crate::db::commands;
use crate::db::connect;

use super::error::CommandError;
use super::models::InsertBookmarkRequest;

fn test_dir() -> PathBuf {
    let path = temp_dir();
    let uuid = Uuid::new_v4();
    let path_string = format!("{}/{}", path.to_str().unwrap(), uuid.to_string());
    PathBuf::from(path_string)
}

#[tokio::test]
async fn test1() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let result = commands::is_exists_tag(app.state(), "hello".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "aaaa".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "こんにちは".to_string()).await?;
    assert!(result == false);

    Ok(())
}

#[tokio::test]
async fn test2() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let result = commands::is_exists_tag(app.state(), "hello".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "aaaa".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "".to_string()).await?;
    assert!(result == false);
    let result = commands::is_exists_tag(app.state(), "こんにちは".to_string()).await?;
    assert!(result == false);

    commands::insert_tags_if_not_exists(
        &app.state(),
        &vec!["hello".to_string(), "aaa".to_string()],
    )
    .await?;

    let result = commands::is_exists_tag(app.state(), "hello".to_string()).await?;
    assert!(result);
    let result = commands::is_exists_tag(app.state(), "aaa".to_string()).await?;
    assert!(result);

    commands::insert_tags_if_not_exists(
        &app.state(),
        &vec!["hello".to_string(), "aaa".to_string()],
    )
    .await?;

    commands::insert_tags_if_not_exists(
        &app.state(),
        &vec![
            "hello_world".to_string(),
            "hello_world".to_string(),
            "hello_world".to_string(),
            "hello_world".to_string(),
        ],
    )
    .await?;

    commands::insert_tags_if_not_exists(
        &app.state(),
        &vec![
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
            "tag5".to_string(),
            "tag6".to_string(),
            "tag7".to_string(),
            "tag8".to_string(),
            "tag9".to_string(),
            "tag10".to_string(),
            "tag11".to_string(),
            "tag12".to_string(),
            "tag13".to_string(),
            "tag14".to_string(),
            "tag15".to_string(),
            "tag16".to_string(),
            "tag17".to_string(),
            "tag18".to_string(),
            "tag19".to_string(),
        ],
    )
    .await?;

    Ok(())
}

#[tokio::test]
async fn test3() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let req = InsertBookmarkRequest {
        description: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "tag1".to_string(),
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;

    let req = InsertBookmarkRequest {
        description: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![],
    };
    let result = commands::insert_bookmark(app.state(), req).await;
    assert_eq!(result.unwrap_err(), CommandError::Validation);

    let req = InsertBookmarkRequest {
        description: "desc".to_string(),
        title: "".to_string(),
        url: "url".to_string(),
        tags: vec![
            "tag1".to_string(),
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
        ],
    };
    let result = commands::insert_bookmark(app.state(), req).await;
    assert_eq!(result.unwrap_err(), CommandError::Validation);

    let req = InsertBookmarkRequest {
        description: "desc".to_string(),
        title: "title".to_string(),
        url: "".to_string(),
        tags: vec![
            "tag1".to_string(),
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
        ],
    };
    let result = commands::insert_bookmark(app.state(), req).await;
    assert_eq!(result.unwrap_err(), CommandError::Validation);

    let req = InsertBookmarkRequest {
        description: "".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "tag1".to_string(),
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;

    Ok(())
}

#[tokio::test]
async fn test4() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    commands::insert_tags_if_not_exists(
        &app.state(),
        &vec![
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
            "tag5".to_string(),
            "tag6".to_string(),
            "tag7".to_string(),
            "tag8".to_string(),
            "tag9".to_string(),
            "tag10".to_string(),
            "tag11".to_string(),
            "tag12".to_string(),
            "tag13".to_string(),
            "tag14".to_string(),
            "tag15".to_string(),
            "tag16".to_string(),
            "tag17".to_string(),
            "tag18".to_string(),
            "tag19".to_string(),
        ],
    )
    .await?;

    let result = commands::find_tag(app.state(), "ta".to_string()).await?;
    assert_eq!(
        result,
        vec![
            "tag2".to_string(),
            "tag3".to_string(),
            "tag4".to_string(),
            "tag5".to_string(),
            "tag6".to_string(),
            "tag7".to_string(),
            "tag8".to_string(),
            "tag9".to_string(),
            "tag10".to_string(),
            "tag11".to_string(),
            "tag12".to_string(),
            "tag13".to_string(),
            "tag14".to_string(),
            "tag15".to_string(),
            "tag16".to_string(),
            "tag17".to_string(),
            "tag18".to_string(),
            "tag19".to_string(),
        ]
    );
    
    

    Ok(())
}
