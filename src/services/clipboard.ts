import { readText } from "@tauri-apps/plugin-clipboard-manager";

export namespace ClipBoardManager {
    export async function read(){
        return readText()
    }
}