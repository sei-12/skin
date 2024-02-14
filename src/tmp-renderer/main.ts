import { HotkeyMap } from "./app/hotkeymap";
import { RootElement } from "./html/html";
import * as UI from "./ui/ui"

import './index.css';

const root_elm = new RootElement(document.body as HTMLBodyElement)
const hotkey_map = new HotkeyMap()


hotkey_map.set_hotkey("Enter", () => UI.Home.open_bookmark())
hotkey_map.set_hotkey("ArrowDown",() => UI.Home.focus_down_bookmarklist())
hotkey_map.set_hotkey("ArrowUp"  ,() => UI.Home.focus_up_bookmarklist())

root_elm.home.input_tag.input_box.addEventListener(
    "input", (e) => UI.Home.handle_input_input_tag_box(e)
)
root_elm.home.input_tag.input_box.addEventListener(
    "keydown", (e) => UI.Home.handle_keydown_input_tag_box(e)
)
root_elm.home.input_tag.input_box.addEventListener(
    "keyup", (e) => UI.Home.handle_keyup_input_tag_box(e)
)
const mo1 = new MutationObserver(() => UI.Home.handle_mut_tag_list())
mo1.observe(root_elm.home.input_tag.inputed_tags,{childList: true})



