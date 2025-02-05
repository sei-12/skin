import { readText } from "@tauri-apps/plugin-clipboard-manager";

export namespace ClipBoardManager {
    export async function read(): Promise<string>{
        try {
            return await readText()
        }catch{
            return ""
        }
    }
}