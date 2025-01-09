

import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { register } from "@tauri-apps/plugin-global-shortcut";

if ( import.meta.env.MODE === "production" ){
    getCurrentWindow().setVisibleOnAllWorkspaces(true)

    register("Alt+Z", async (event) => {
        if (event.state === "Released") {
            return;
        }

        const curVisibility = await WindowVisibleController.currentVisible();
        if (curVisibility) {
            WindowVisibleController.hide();
        } else {
            WindowVisibleController.show();
        }
    });

    listen("tauri://blur", async () => {
        WindowVisibleController.hide();
    });
}



/**
 * ウィンドウの表示/非表示関係の処理がとてもテストしにくいため、別のモジュールに分ける
 */
export namespace WindowVisibleController {

    export function show() {
        if ( import.meta.env.MODE !== "production" ){ return }
        const curWinodw = getCurrentWindow()
        curWinodw.show()
        curWinodw.setFocus()
    }

    export function hide() {
        if ( import.meta.env.MODE !== "production" ){ return }
        const curWinodw = getCurrentWindow()
        curWinodw.hide()
    }

    export function currentVisible() {
        return getCurrentWindow().isVisible()
    }
}