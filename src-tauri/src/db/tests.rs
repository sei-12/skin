use std::{env::temp_dir, path::PathBuf};

use rand::seq::SliceRandom;
use tauri::Manager;

use crate::db::commands;
use crate::db::connect;
use crate::db::models::EditBookmarkRequest;
use crate::db::DbPool;

use super::error::CommandError;
use super::models::Bookmark;
use super::models::BookmarkRecord;
use super::models::InsertBookmarkRequest;

fn tmp_dir() -> PathBuf {
    let path = temp_dir();

    path.join(test_utils::gen_ascii_chars(12))
}

// 不具合を発見した時に使う
#[allow(unused)]
fn debug_dir(name: &str) -> PathBuf {
    PathBuf::from(format!("./__debug__/{}", name))
}

#[test]
fn test1() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        let result = commands::is_exists_tag(app.state(), "hello".to_string()).await?;
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "aaaa".to_string()).await?;
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "".to_string()).await?;
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "こんにちは".to_string()).await?;
        assert!(!result);

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
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "aaaa".to_string()).await?;
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "".to_string()).await?;
        assert!(!result);
        let result = commands::is_exists_tag(app.state(), "こんにちは".to_string()).await?;
        assert!(!result);

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

    pub(super) async fn i_bkmk(
        pool: State<'_, DbPool>,
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

    pub(super) async fn f_bkmk(
        pool: State<'_, DbPool>,
        tags: &[&str],
    ) -> Result<Vec<crate::db::models::Bookmark>, CommandError> {
        commands::find_bookmark(pool, tags.iter().map(|s| s.to_string()).collect()).await
    }

    pub(super) async fn i_random_bkmk_no_check(app: &App<MockRuntime>) -> Result<(), CommandError> {
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

        Ok(())
    }

    pub(super) async fn i_random_bkmk(app: &App<MockRuntime>) -> Result<(), CommandError> {
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
            !result.is_empty(),
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

#[test]
fn test15() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        for _ in 0..500 {
            test_utils::i_random_bkmk(&app).await?;
        }

        let result = commands::fetch_bookmarks(app.state(), 100).await?;

        assert_eq!(result.len(), 100);

        Ok(())
    })
}

#[test]
fn test16() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        for _ in 0..2000 {
            test_utils::i_random_bkmk_no_check(&app).await?;
        }

        let result = commands::fetch_bookmarks(app.state(), 1000).await?;

        assert_eq!(result.len(), 1000);

        Ok(())
    })
}

#[test]
fn test17() -> Result<(), CommandError> {
    tauri::async_runtime::block_on(async {
        let app = tauri::test::mock_app();
        let path = tmp_dir();

        let con = connect(path).await.expect("error connect");
        app.manage(con);

        for _ in 0..100 {
            test_utils::i_random_bkmk_no_check(&app).await?;
        }

        test_utils::i_bkmk(
            app.state(),
            "hello",
            "url",
            "desc",
            &["hello_world", "hello-world", "hello!world"],
        )
        .await?;

        let result = commands::fetch_bookmarks(app.state(), 10).await?;
        assert_eq!(result.len(), 10);
        assert_eq!(
            result[0],
            Bookmark {
                id: 101,
                title: "hello".to_string(),
                url: "url".to_string(),
                desc: "desc".to_string(),
                tags: vec![
                    "hello_world".to_string(),
                    "hello-world".to_string(),
                    "hello!world".to_string(),
                ]
            }
        );

        Ok(())
    })
}

#[test]
fn test18() -> Result<(), CommandError> {
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
        assert_eq!(result.len(), 1);

        let req = EditBookmarkRequest {
            id: 1,
            desc: "edited desc".to_string(),
            title: "edited title".to_string(),
            url: "edited url".to_string(),
            tags: vec!["edited".to_string(), "a".to_string()],
        };

        commands::edit_bookmark(app.state(), req).await?;
        let mut result = commands::find_bookmark(app.state(), vec!["a".to_string()]).await?;
        assert_eq!(result.len(), 1);
        let edited = result.pop().unwrap();
        assert_eq!(edited.desc, "edited desc");
        assert_eq!(edited.title, "edited title");
        assert_eq!(edited.url, "edited url");

        let result = commands::find_bookmark(app.state(), vec!["ab".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["abc".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["b".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["edited".to_string()]).await?;
        assert_eq!(result.len(), 1);

        // bad req
        let bad_req = EditBookmarkRequest {
            id: 1,
            desc: "helloworld".to_string(),
            title: "".to_string(),
            url: "edited url".to_string(),
            tags: vec![
                "bad_req_tag".to_string(),
                "edited".to_string(),
                "a".to_string(),
            ],
        };
        let result = commands::edit_bookmark(app.state(), bad_req).await;
        assert!(matches!(result, Err(CommandError::Validation)));
        // bad reqを送った後に変更が加えられていないことを確認
        let result = commands::find_bookmark(app.state(), vec!["ab".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["abc".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["b".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["edited".to_string()]).await?;
        assert_eq!(result.len(), 1);
        let result = commands::find_tag(app.state(), "a".to_string()).await?;
        assert_eq!(result.len(), 3);
        let result = commands::find_tag(app.state(), "bad_req_tag".to_string()).await?;
        assert_eq!(result.len(), 0);

        // bad req
        let bad_req = EditBookmarkRequest {
            id: 1,
            desc: "helloworld".to_string(),
            title: "helloworld".to_string(),
            url: "".to_string(),
            tags: vec![
                "bad_req_tag".to_string(),
                "edited".to_string(),
                "a".to_string(),
            ],
        };
        let result = commands::edit_bookmark(app.state(), bad_req).await;
        assert!(matches!(result, Err(CommandError::Validation)));
        // bad reqを送った後に変更が加えられていないことを確認
        let result = commands::find_bookmark(app.state(), vec!["ab".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["abc".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["b".to_string()]).await?;
        assert_eq!(result.len(), 0);
        let result = commands::find_bookmark(app.state(), vec!["edited".to_string()]).await?;
        assert_eq!(result.len(), 1);
        let result = commands::find_tag(app.state(), "a".to_string()).await?;
        assert_eq!(result.len(), 3);
        let result = commands::find_tag(app.state(), "bad_req_tag".to_string()).await?;
        assert_eq!(result.len(), 0);

        // bad req
        let bad_req = EditBookmarkRequest {
            id: 1,
            desc: "helloworld".to_string(),
            title: "helloworld".to_string(),
            url: "helloworld".to_string(),
            tags: vec![],
        };
        let result = commands::edit_bookmark(app.state(), bad_req).await;
        assert!(matches!(result, Err(CommandError::Validation)));
        // bad reqを送った後に変更が加えられていないことを確認
        let result = commands::find_tag(app.state(), "a".to_string()).await?;
        assert_eq!(result.len(), 3);
        let result = commands::find_tag(app.state(), "bad_req_tag".to_string()).await?;
        assert_eq!(result.len(), 0);

        Ok(())
    })
}

#[test]
fn test19() -> Result<(), CommandError> {
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
        assert_eq!(result.len(), 1);

        let result = commands::get_bookmark(app.state(), 1).await?;
        assert_eq!(
            result,
            Bookmark {
                desc: "desc".to_string(),
                id: 1,
                title: "title".to_string(),
                url: "url".to_string(),
                tags: vec![
                    "ab".to_string(),
                    "a".to_string(),
                    "abc".to_string(),
                    "b".to_string(),
                ],
            }
        );

        let result = commands::get_bookmark(app.state(), 2).await;
        assert!(result.is_err());

        Ok(())
    })
}

#[test]
fn test20() -> Result<(), CommandError> {
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

        let result = commands::fuzzy_find_tag(app.state(), "hello".to_string()).await?;
        assert_eq!(result.len(),0);

        let result = commands::fuzzy_find_tag(app.state(), "tag".to_string()).await?;
        assert_eq!(result.len(),18);

        let result = commands::fuzzy_find_tag(app.state(), "t1".to_string()).await?;
        assert_eq!(result.len(),10);

        let result = commands::fuzzy_find_tag(app.state(), "".to_string()).await?;
        assert_eq!(result.len(),0);

        Ok(())
    })
}
