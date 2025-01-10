use std::{env::temp_dir, path::PathBuf};

use rand::seq::SliceRandom;
use tauri::Manager;

use crate::db::commands;
use crate::db::connect;
use crate::db::DbPool;

use super::error::CommandError;
use super::models::Bookmark;
use super::models::BookmarkRecord;
use super::models::InsertBookmarkRequest;

fn tmp_dir() -> PathBuf {
    let path = temp_dir();
    let path_string = path.join(test_utils::gen_ascii_chars(12));

    path_string
}

// 不具合を発見した時に使う
#[allow(unused)]
fn debug_dir(name: &str) -> PathBuf {
    let path = PathBuf::from(format!("./__debug__/{}", name));
    path
}

#[test]
fn test1() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test2() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test3() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test4() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test5_sort() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        for _ in 0..5 {
            let app = tauri::test::mock_app();
            let path = tmp_dir();

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
    })
}

#[test]
fn test6_sort() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        for _ in 0..5 {
            let app = tauri::test::mock_app();
            let path = tmp_dir();

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
    })
}

#[test]
fn test7() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

/**
 * タグは重複しない
 */
#[test]
fn test8() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test9() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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
    })
}

#[test]
fn test10() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

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

        let result =
            commands::find_bookmark(app.state(), vec!["a".to_string(), "b".to_string()]).await?;

        let expect: Vec<Bookmark> = vec![];
        assert_eq!(expect, result);

        //　エラーではない.
        commands::delete_bookmark(app.state(), 1).await?;

        Ok(())
    })
}

mod test_utils {
    use crate::db::{commands, error::CommandError, models::InsertBookmarkRequest, DbPool};
    use rand::Rng;
    use tauri::{test::MockRuntime, App, Manager, State};

    pub(super) async fn i_bkmk<'a>(
        pool: State<'a, DbPool>,
        title: &str,
        url: &str,
        desc: &str,
        tags: &[&str],
    ) -> Result<(), CommandError> {
        let req = InsertBookmarkRequest {
            desc: desc.to_string(),
            title: title.to_string(),
            url: url.to_string(),
            tags: tags.iter().map(|s| s.to_string()).collect(),
        };
        commands::insert_bookmark(pool, req).await?;
        Ok(())
    }

    pub(super) async fn f_bkmk<'a>(
        pool: State<'a, DbPool>,
        tags: &[&str],
    ) -> Result<Vec<crate::db::models::Bookmark>, CommandError> {
        commands::find_bookmark(pool, tags.iter().map(|s| s.to_string()).collect()).await
    }

    pub(super) async fn i_random_bkmk<'a>(app: &App<MockRuntime>) -> Result<(), CommandError> {
        let title = gen_ascii_chars(10);
        let url = gen_ascii_chars(10);
        let desc = gen_ascii_chars(10);
        let mut tags: Vec<String> = Vec::new();

        let tag_count = rand::thread_rng().gen_range(1..30);
        for _ in 0..tag_count {
            tags.push(gen_ascii_chars(rand::thread_rng().gen_range(1..10)));
        }

        commands::insert_bookmark(
            app.state(),
            InsertBookmarkRequest {
                title: title.clone(),
                url: url.clone(),
                desc: desc.clone(),
                tags: tags.clone(),
            },
        )
        .await?;

        let result = commands::find_bookmark(app.state(), tags.clone()).await?;

        assert!(
            result.len() >= 1,
            "bug: 
                result.len() = {}
                tags = {:?}
                title = {}
                url = {}
                desc = {}
            ",
            result.len(),
            tags,
            title,
            url,
            desc,
        );

        Ok(())
    }

    extern crate rand;
    use rand::seq::SliceRandom;

    const BASE_STR: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    pub fn gen_ascii_chars(size: usize) -> String {
        let mut rng = &mut rand::thread_rng();
        String::from_utf8(
            BASE_STR
                .as_bytes()
                .choose_multiple(&mut rng, size)
                .cloned()
                .collect(),
        )
        .unwrap()
    }
}

#[test]
fn test11() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        let result = test_utils::i_bkmk(
            app.state(),
            "title",
            "url",
            "desc",
            &["hello_world", "vali error"],
        )
        .await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "title", "url", "desc", &[""]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "title", "url", "desc", &[" "]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "", "url", "desc", &["hello"]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "title", "", "desc", &["hello"]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "title", "url", "desc", &[]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        let result = test_utils::i_bkmk(app.state(), "", "", "", &[]).await;
        assert_eq!(result.unwrap_err(), CommandError::Validation);

        Ok(())
    })
}

#[test]
fn test12() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        test_utils::i_bkmk(app.state(), "title1", "6678", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title2", "7678", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title3", "8678", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title4", "9678", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title5", "1068", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title6", "1168", "", &["hello"]).await?;
        test_utils::i_bkmk(app.state(), "title7", "1268", "", &["hello"]).await?;

        let res = test_utils::f_bkmk(app.state(), &["hello"]).await?;

        assert!(res.len() == 7);

        Ok(())
    })
}

#[test]
fn test13() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();
        // let path = debug_dir("test13");

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        // 2,3回は成功する

        for _ in 0..100 {
            test_utils::i_random_bkmk(&app).await?;
        }

        let result: Vec<BookmarkRecord> = sqlx::query_as("select * from bookmarks")
            .fetch_all(app.state::<DbPool>().inner())
            .await?;

        assert_eq!(result.len(), 100);

        Ok(())
    })
}

#[test]
fn test14() -> Result<(), CommandError> {
    // タグ検索において大文字小文字を区別しない

    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        commands::insert_tags_if_not_exists(
            &app.state(),
            &vec![
                "Hello".to_string(),
                "hEllo".to_string(),
                "hello".to_string(),
            ],
        )
        .await?;

        let result = commands::find_tag(app.state(), String::from("hello")).await?;
        assert_eq!(result.len(), 3);
        assert_eq!(
            result,
            vec![
                "Hello".to_string(),
                "hEllo".to_string(),
                "hello".to_string(),
            ],
        );
        Ok(())
    })
}
