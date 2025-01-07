import { readText } from "@tauri-apps/plugin-clipboard-manager";

export namespace ClipBoardManager {
    export async function read(): Promise<string>{
        // fix: Unhandled Promise Rejection: The clipboard contents were not available in the requested format or the clipboard is empty.
        try {
            return await readText()
        }catch{
            return ""
        }
    }
}