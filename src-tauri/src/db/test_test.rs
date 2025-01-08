


// 通った
// #[test]
// fn test_tmp_dir(){
//     use std::env::temp_dir;
//     let path = temp_dir();
//     println!("{:?}",path);    
// }


// process didn't exit successfully: `D:\a\skin\skin\src-tauri\target\debug\deps\skin_lib-1f62670fd56f937a.exe` (exit code: 0xc0000139, STATUS_ENTRYPOINT_NOT_FOUND)
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