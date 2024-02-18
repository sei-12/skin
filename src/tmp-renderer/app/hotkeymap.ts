import { RootElement } from "../html/html"
import { get_current_page_name } from "./page"

type Handler = () => void

export class HotkeyMap {
    keydownHotkeyMap: { [key: string]: Handler }

    constructor() {
        this.keydownHotkeyMap = {}
    }

    set_hotkey(hash_key: string, handler: () => void) {
        if (this.keydownHotkeyMap[hash_key] === undefined) {
            this.keydownHotkeyMap[hash_key] = handler
        }
    }

    get_hotkey(hash_key: string): Handler | null {
        if (this.keydownHotkeyMap[hash_key] === undefined) {
            return null
        }

        return this.keydownHotkeyMap[hash_key]
    }
}



export function get_when(e: KeyboardEvent, root: RootElement) {
    let elms: string[] = []

    let page = get_current_page_name(root)
    if (page instanceof Error) {
        return page
    } else {
        elms.push(page)
    }

    // TODO 設計に問題あり
    if (
        root.home.tag_suggestion_window.elm.style.display === "block" ||
        root.add.form.tag_suggestion_window.elm.style.display === "block"
    ) {
        elms.push("tag_suggestion")
    }

    elms.push(press_key_str(e))

    return elms.join("+")
}

function press_key_str(e: KeyboardEvent) {
    let pressKeys: string[] = []

    if (e.ctrlKey) {
        pressKeys.push("ctrl")
    }
    if (e.shiftKey) {
        pressKeys.push("shift")
    }
    if (e.metaKey) {
        pressKeys.push("meta")
    }
    if (e.altKey) {
        pressKeys.push("alt")
    }
    pressKeys.push(e.key)

    return pressKeys.join("+")
}