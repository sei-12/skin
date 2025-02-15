import { getCurrentWindow } from "@tauri-apps/api/window";

export namespace WindowVisibleController {
    export async function toggle() {
        const v = await currentVisible();
        if (v) {
            hide();
        } else {
            show();
        }
    }

    export function show() {
        const curWinodw = getCurrentWindow();
        curWinodw.show();
        curWinodw.setFocus();
    }

    export function hide() {
        const curWinodw = getCurrentWindow();
        curWinodw.hide();
    }

    export function currentVisible() {
        return getCurrentWindow().isVisible();
    }
}
