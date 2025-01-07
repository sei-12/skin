

// import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
// import { register } from "@tauri-apps/plugin-global-shortcut";


// getCurrentWindow().setVisibleOnAllWorkspaces(true)

// register("Alt+Z", async (event) => {
//     if (event.state === "Released") {
//         return;
//     }

//     const curVisibility = await WindowVisibleController.currentVisible();
//     if (curVisibility) {
//         WindowVisibleController.hide();
//     } else {
//         WindowVisibleController.show();
//         // tagInputBoxHook.inputBoxRef.current?.focus();
//     }
// });

// listen("tauri://blur", async () => {
//     WindowVisibleController.hide();
//     // 再度開いた時に前回の検索結果などが残らないようにする。
//     // tagInputBoxHook.setInputedTags([]);
// });

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