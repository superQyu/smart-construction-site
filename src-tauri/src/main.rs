// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod service;
use crate::service::{get_file_modified_time, write_config_to_file};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_file_modified_time])
        .invoke_handler(tauri::generate_handler![write_config_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
