


// 通った
// #[test]
// fn test_tmp_dir(){
//     use std::env::temp_dir;
//     let path = temp_dir();
//     println!("{:?}",path);    
// }

#[test]
fn test_tauri_mock_app(){
    let app = tauri::test::mock_app();
    println!("{:?}",app);
}

// #[test]
// fn test_rand() {
//     let random_val: u32 = rand::random();
//     println!("{}",random_val);
// }