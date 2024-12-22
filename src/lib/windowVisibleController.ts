

import { getCurrentWindow } from "@tauri-apps/api/window";


getCurrentWindow().setVisibleOnAllWorkspaces(true)

/**
 * ウィンドウの表示/非表示関係の処理がとてもテストしにくいため、別のモジュールに分ける
 */
export namespace WindowVisibleController {

    export function show(){
        let curWinodw = getCurrentWindow()
        curWinodw.show()
        curWinodw.setFocus()
    }
    
    export function hide(){
        let curWinodw = getCurrentWindow()        
        curWinodw.hide()
    }
    
    export function currentVisible(){
        return getCurrentWindow().isVisible()
    }
}