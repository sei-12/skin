use std::{env::temp_dir, path::PathBuf};

use tauri::Manager;
use uuid::Uuid;

use crate::db::connect;
use crate::db::commands;

use super::error::CommandError;


fn test_dir() -> PathBuf {
    let path = temp_dir();    
    let uuid = Uuid::new_v4();
    let path_string = format!("{}/{}",path.to_str().unwrap(),uuid.to_string());
    PathBuf::from(path_string)
}

#[tokio::test]
async fn test1() -> Result<(), CommandError>{
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

    Ok(())
    // let result = db::commands::fetch_samples(app.state()).await;
    // let expect: Vec<Sample> = Vec::new();
    // assert_eq!(expect,result.unwrap());
    
    // db::commands::insert_sample(app.state(), RequestInsertSample {
    //     content: "hello".to_string()
    // }).await.unwrap();
    
    // let result = db::commands::fetch_samples(app.state()).await;
    // let expect: Vec<Sample> = vec![
    //     Sample { id: 1, content: "hello".to_string() },
    // ];
    // assert_eq!(expect,result.unwrap());
    
    // db::commands::insert_sample(app.state(), RequestInsertSample {
    //     content: "hello".to_string()
    // }).await.unwrap();
    
    // let result = db::commands::fetch_samples(app.state()).await;
    // let expect: Vec<Sample> = vec![
    //     Sample { id: 1, content: "hello".to_string() },
    //     Sample { id: 2, content: "hello".to_string() },
    // ];
    // assert_eq!(expect,result.unwrap());
}