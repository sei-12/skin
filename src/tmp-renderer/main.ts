import { HotkeyMap, get_when } from "./app/hotkeymap";
import { RootElement } from "./html/html";
import * as UI from "./ui/ui"

import './index.css';

const root_elm = new RootElement(document.body as HTMLBodyElement)
const hotkey_map = new HotkeyMap()

hotkey_map.set_hotkey("home+Enter",
    () => UI.Home.open_bookmark(
        window.app.open_bookmark,
        root_elm.home.searched_bkmks,
    )
)
hotkey_map.set_hotkey("home+ArrowDown",
    () => UI.Home.focus_down_bookmarklist(
        root_elm.home.searched_bkmks
    )
)
hotkey_map.set_hotkey("home+ArrowUp",
    () => UI.Home.focus_up_bookmarklist(
        root_elm.home.searched_bkmks
    )
)

hotkey_map.set_hotkey("home+ctrl+/",
    () => UI.Home.focus_input_tag_box(
        root_elm.home.input_tag
    )
)

hotkey_map.set_hotkey("home+tag_suggestion+Enter",
    () => UI.Home.tag_complement(
        root_elm.home.tag_sugestion_window,
        root_elm.home.input_tag,
        window.app.tag_exists_db
    )
)
hotkey_map.set_hotkey("home+tag_suggestion+ArrowDown",
    () => UI.Home.focus_down_tag_suggestion(
        root_elm.home.tag_sugestion_window
    )
)
hotkey_map.set_hotkey("home+tag_suggestion+ArrowUp",
    () => UI.Home.focus_up_tag_suggestion(
        root_elm.home.tag_sugestion_window
    )
)

root_elm.home.input_tag.input_box.addEventListener(
    "input", (e) => UI.Home.handle_input_input_tag_box(
        e,
        window.app.fetch_suggestion,
        root_elm.home.tag_sugestion_window
    )
)
root_elm.home.input_tag.input_box.addEventListener(
    "keydown", (e) => UI.Home.handle_keydown_input_tag_box(
        e,
        root_elm.home.input_tag
    )
)
root_elm.home.input_tag.input_box.addEventListener(
    "keyup", (e) => UI.Home.handle_keyup_input_tag_box(
        e,
        window.app.tag_exists_db,
        root_elm.home.input_tag
    )
)
const mo1 = new MutationObserver(
    () => UI.Home.handle_mut_tag_list(
        root_elm.home.input_tag,
        window.app.search_bookmarks,
        window.app.fetch_hit_tags,
        root_elm.home.hit_tag_list,
        root_elm.home.searched_bkmks
    )
)
mo1.observe(root_elm.home.input_tag.inputed_tags, { childList: true })



window.addEventListener("keydown", (e) => {
    let when = get_when(e, root_elm)
    if (when instanceof Error) {
        throw when
    }

    let handler = hotkey_map.get_hotkey(when)

    if (handler === null) {
        return
    }

    handler()
})