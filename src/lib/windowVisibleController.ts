

import { getCurrentWindow } from "@tauri-apps/api/window";


getCurrentWindow().setVisibleOnAllWorkspaces(true)

/**
 * ウィンドウの表示/非表示関係の処理がとてもテストしにくいため、別のモジュールに分ける
 */
export namespace WindowVisibleController {

    export function show() {
        const curWinodw = getCurrentWindow()
        curWinodw.show()
        curWinodw.setFocus()
    }

    export function hide() {
        const curWinodw = getCurrentWindow()
        curWinodw.hide()
    }

    export function currentVisible() {
        return getCurrentWindow().isVisible()
    }
}