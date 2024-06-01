import SQLite from 'tauri-plugin-sqlite-api'
import { Store } from "tauri-plugin-store-api";

let g_sqlite: SQLite | null = null
let g_store: Store | null = null


export namespace DbAPI {
    export async function open() {
        
    }
}