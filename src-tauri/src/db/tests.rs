use std::{env::temp_dir, path::PathBuf};

use rand::seq::SliceRandom;
use tauri::Manager;
use uuid::Uuid;

use crate::db::commands;
use crate::db::connect;

use super::error::CommandError;
use super::models::Bookmark;
use super::models::InsertBookmarkRequest;

fn test_dir() -> PathBuf {
    let path = temp_dir();
    let uuid = Uuid::new_v4();
    let path_string = path.join(uuid.to_string());
    
    path_string
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
        desc: "desc".to_string(),
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
        desc: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![],
    };
    let result = commands::insert_bookmark(app.state(), req).await;
    assert_eq!(result.unwrap_err(), CommandError::Validation);

    let req = InsertBookmarkRequest {
        desc: "desc".to_string(),
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
        desc: "desc".to_string(),
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
        desc: "".to_string(),
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

    Ok(())
}

#[tokio::test]
async fn test5_sort() -> Result<(), CommandError> {
    for _ in 0..5 {
        let app = tauri::test::mock_app();
        let path = test_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        let mut tags = vec![
            "aaaaa".to_string(),
            "aaaa".to_string(),
            "aaaaaa".to_string(),
            "a".to_string(),
            "aa".to_string(),
            "aaa".to_string(),
        ];
        let mut rng = rand::thread_rng();
        tags.shuffle(&mut rng);

        commands::insert_tags_if_not_exists(&app.state(), &tags).await?;

        let result = commands::find_tag(app.state(), "a".to_string()).await?;
        assert_eq!(
            result,
            vec![
                "a".to_string(),
                "aa".to_string(),
                "aaa".to_string(),
                "aaaa".to_string(),
                "aaaaa".to_string(),
                "aaaaaa".to_string(),
            ]
        );
    }
    Ok(())
}

#[tokio::test]
async fn test6_sort() -> Result<(), CommandError> {
    for _ in 0..5 {
        let app = tauri::test::mock_app();
        let path = test_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        let mut tags = vec![
            "a".to_string(),
            "aa".to_string(),
            "ab".to_string(),
            "ac".to_string(),
            "ad".to_string(),
            "ae".to_string(),
            "aaa".to_string(),
            "aab".to_string(),
            "abc".to_string(),
        ];
        let mut rng = rand::thread_rng();
        tags.shuffle(&mut rng);

        commands::insert_tags_if_not_exists(&app.state(), &tags).await?;

        let result = commands::find_tag(app.state(), "a".to_string()).await?;
        assert_eq!(
            result,
            vec![
                "a".to_string(),
                "aa".to_string(),
                "ab".to_string(),
                "ac".to_string(),
                "ad".to_string(),
                "ae".to_string(),
                "aaa".to_string(),
                "aab".to_string(),
                "abc".to_string(),
            ]
        );
    }
    Ok(())
}

#[tokio::test]
async fn test7() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let req = InsertBookmarkRequest {
        desc: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "ab".to_string(),
            "a".to_string(),
            "abc".to_string(),
            "b".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;

    let result = commands::find_tag(app.state(), "a".to_string()).await?;
    assert_eq!(
        result,
        vec!["a".to_string(), "ab".to_string(), "abc".to_string(),]
    );

    let result = commands::find_tag(app.state(), "".to_string()).await?;
    let expect: Vec<String> = vec![];
    assert_eq!(result, expect);

    Ok(())
}

/**
 * タグは重複しない
 */
#[tokio::test]
async fn test8() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let req = InsertBookmarkRequest {
        desc: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "ab".to_string(),
            "a".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "abc".to_string(),
            "b".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;

    let result = commands::find_tag(app.state(), "a".to_string()).await?;
    assert_eq!(
        result,
        vec!["a".to_string(), "ab".to_string(), "abc".to_string(),]
    );

    let result = commands::find_tag(app.state(), "".to_string()).await?;
    let expect: Vec<String> = vec![];
    assert_eq!(result, expect);

    Ok(())
}

#[tokio::test]
async fn test9() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);

    let req = InsertBookmarkRequest {
        desc: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "ab".to_string(),
            "a".to_string(),
            "abc".to_string(),
            "b".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;

    let result = commands::find_bookmark(app.state(), vec!["a".to_string()]).await?;

    assert_eq!(
        vec![Bookmark {
            id: 1,
            title: "title".to_string(),
            url: "url".to_string(),
            desc: "desc".to_string(),
            tags: vec![
                "ab".to_string(),
                "a".to_string(),
                "abc".to_string(),
                "b".to_string(),
            ]
        }],
        result
    );

    let result =
        commands::find_bookmark(app.state(), vec!["a".to_string(), "b".to_string()]).await?;

    assert_eq!(
        vec![Bookmark {
            id: 1,
            title: "title".to_string(),
            url: "url".to_string(),
            desc: "desc".to_string(),
            tags: vec![
                "ab".to_string(),
                "a".to_string(),
                "abc".to_string(),
                "b".to_string(),
            ]
        }],
        result
    );

    let result = commands::find_bookmark(
        app.state(),
        vec!["a".to_string(), "b".to_string(), "abc".to_string()],
    )
    .await?;

    assert_eq!(
        vec![Bookmark {
            id: 1,
            title: "title".to_string(),
            url: "url".to_string(),
            desc: "desc".to_string(),
            tags: vec![
                "ab".to_string(),
                "a".to_string(),
                "abc".to_string(),
                "b".to_string(),
            ]
        }],
        result
    );

    let result = commands::find_bookmark(
        app.state(),
        vec![
            "a".to_string(),
            "b".to_string(),
            "abc".to_string(),
            "hello".to_string(),
        ],
    )
    .await?;

    let expect: Vec<Bookmark> = vec![];
    assert_eq!(expect, result);

    Ok(())
}

#[tokio::test]
async fn test10() -> Result<(), CommandError> {
    let app = tauri::test::mock_app();
    let path = test_dir();

    let con = connect(path).await.expect("error connect");
    app.manage(con);
    
    let req = InsertBookmarkRequest {
        desc: "desc".to_string(),
        title: "title".to_string(),
        url: "url".to_string(),
        tags: vec![
            "ab".to_string(),
            "a".to_string(),
            "abc".to_string(),
            "b".to_string(),
        ],
    };
    commands::insert_bookmark(app.state(), req).await?;
    
    commands::delete_bookmark(app.state(), 1).await?;
    
    let result = commands::find_bookmark(
        app.state(),
        vec![
            "a".to_string(),
            "b".to_string(),
        ],
    )
    .await?;

    let expect: Vec<Bookmark> = vec![];
    assert_eq!(expect, result);
    
    //　エラーではない.
    commands::delete_bookmark(app.state(), 1).await?;

    Ok(())
}