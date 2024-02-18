import { HotkeyMap, get_when } from "./app/hotkeymap";
import { RootElement } from "./html/html";
import * as UI from "./ui/ui"

import './index.css';

const root_elm = new RootElement(document.body as HTMLBodyElement)
const hotkey_map = new HotkeyMap()


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                             HOME PAGE                                              //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
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

hotkey_map.set_hotkey("home+ctrl+n",
    () => UI.Home.goto_add_page(
        root_elm
    )
)

hotkey_map.set_hotkey("home+tag_suggestion+Enter",
    () => UI.AnyPage.tag_complement(
        root_elm.home.tag_suggestion_window,
        root_elm.home.input_tag,
        window.app.tag_exists_db
    )
)
hotkey_map.set_hotkey("home+tag_suggestion+ArrowDown",
    () => UI.AnyPage.focus_down_tag_suggestion(
        root_elm.home.tag_suggestion_window
    )
)
hotkey_map.set_hotkey("home+tag_suggestion+ArrowUp",
    () => UI.AnyPage.focus_up_tag_suggestion(
        root_elm.home.tag_suggestion_window
    )
)

root_elm.home.input_tag.elm.addEventListener(
    "click", () => UI.Home.focus_input_tag_box(
        root_elm.home.input_tag
    )
)
root_elm.home.input_tag.input_box.addEventListener(
    "input", (e) => UI.AnyPage.handle_input_input_tag_box(
        e,
        window.app.fetch_suggestion,
        root_elm.home.tag_suggestion_window
    )
)
root_elm.home.input_tag.input_box.addEventListener(
    "keydown", (e) => UI.AnyPage.handle_keydown_input_tag_box(
        e,
        root_elm.home.input_tag
    )
)
root_elm.home.input_tag.input_box.addEventListener(
    "keyup", (e) => UI.AnyPage.handle_keyup_input_tag_box(
        e,
        window.app.tag_exists_db,
        root_elm.home.input_tag
    )
)
root_elm.home.goto_add_page.elm.addEventListener(
    "click", () => UI.Home.goto_add_page(
        root_elm
    )
)
const mo1 = new MutationObserver(
    () => UI.Home.reload_bookmarks(
        root_elm.home.input_tag,
        window.app.search_bookmarks,
        window.app.fetch_hit_tags,
        root_elm.home.hit_tag_list,
        root_elm.home.searched_bkmks,
        (data) => UI.AnyPage.goto_edit_bookmark_page(
            data,
            root_elm,
            window.app.fetch_tags_where_link_bkmk
        ),
        (data) => UI.AnyPage.remove_bookmark(
            data,
            window.app.remove_bkmk,
        )
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


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                              ADD PAGE                                              //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

hotkey_map.set_hotkey("add+tag_suggestion+Enter",
    () => UI.AnyPage.tag_complement(
        root_elm.add.form.tag_suggestion_window,
        root_elm.add.form.input_tag,
        window.app.tag_exists_db
    )
)
hotkey_map.set_hotkey("add+tag_suggestion+ArrowDown",
    () => UI.AnyPage.focus_down_tag_suggestion(
        root_elm.add.form.tag_suggestion_window
    )
)
hotkey_map.set_hotkey("add+tag_suggestion+ArrowUp",
    () => UI.AnyPage.focus_up_tag_suggestion(
        root_elm.add.form.tag_suggestion_window
    )
)
hotkey_map.set_hotkey("add+ctrl+/",
    () => UI.Add.focus_input_tag_box(
        root_elm.add.form.input_tag
    )
)
hotkey_map.set_hotkey("add+ctrl+h",
    () => UI.Add.go_home(root_elm)
)
hotkey_map.set_hotkey("add+ctrl+Enter",
    () => UI.Add.add_bookmark(
        root_elm.add.form,
        window.app.add_bookmark
    )
)
root_elm.add.form.done_button.addEventListener(
    "click", () => UI.Add.add_bookmark(
        root_elm.add.form,
        window.app.add_bookmark
    )
)
root_elm.add.go_home.elm.addEventListener(
    "click", () => UI.Add.go_home(root_elm)
)
root_elm.add.form.input_tag.elm.addEventListener(
    "click", () => UI.Add.focus_input_tag_box(
        root_elm.add.form.input_tag
    )
)
root_elm.add.form.url_box.addEventListener(
    "input", () => UI.Add.complement_form_from_url(
        root_elm.add.form,
        window.app.fetch_pageinfo
    )
)
root_elm.add.form.input_tag.input_box.addEventListener(
    "input", (e) => UI.AnyPage.handle_input_input_tag_box(
        e,
        window.app.fetch_suggestion,
        root_elm.add.form.tag_suggestion_window
    )
)
root_elm.add.form.input_tag.input_box.addEventListener(
    "keydown", (e) => UI.AnyPage.handle_keydown_input_tag_box(
        e,
        root_elm.add.form.input_tag
    )
)
root_elm.add.form.input_tag.input_box.addEventListener(
    "keyup", (e) => UI.AnyPage.handle_keyup_input_tag_box(
        e,
        window.app.tag_exists_db,
        root_elm.add.form.input_tag
    )
)

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                         EDIT BOOKMARK PAGE                                         //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
hotkey_map.set_hotkey("edit_bkmk+ctrl+h",
    () => UI.EditBkmk.go_home(root_elm)
)
hotkey_map.set_hotkey("edit_bkmk+tag_suggestion+Enter",
    () => UI.AnyPage.tag_complement(
        root_elm.edit_bkmk.form.tag_suggestion_window,
        root_elm.edit_bkmk.form.input_tag,
        window.app.tag_exists_db
    )
)
hotkey_map.set_hotkey("edit_bkmk+tag_suggestion+ArrowDown",
    () => UI.AnyPage.focus_down_tag_suggestion(
        root_elm.edit_bkmk.form.tag_suggestion_window
    )
)
hotkey_map.set_hotkey("edit_bkmk+tag_suggestion+ArrowUp",
    () => UI.AnyPage.focus_up_tag_suggestion(
        root_elm.edit_bkmk.form.tag_suggestion_window
    )
)
hotkey_map.set_hotkey("edit_bkmk+ctrl+/",
    () => UI.EditBkmk.focus_input_tag_box(
        root_elm.edit_bkmk.form.input_tag
    )
)
root_elm.edit_bkmk.go_home.elm.addEventListener(
    "click", () => UI.EditBkmk.go_home(
        root_elm
    )
)
root_elm.edit_bkmk.form.done_button.addEventListener(
    "click", () => UI.EditBkmk.update_bkmk(
        root_elm.edit_bkmk,
        window.app.update_bkmk,
        root_elm
    )
)
root_elm.edit_bkmk.form.input_tag.input_box.addEventListener(
    "input", (e) => UI.AnyPage.handle_input_input_tag_box(
        e,
        window.app.fetch_suggestion,
        root_elm.edit_bkmk.form.tag_suggestion_window
    )
)
root_elm.edit_bkmk.form.input_tag.input_box.addEventListener(
    "keydown", (e) => UI.AnyPage.handle_keydown_input_tag_box(
        e,
        root_elm.edit_bkmk.form.input_tag
    )
)
root_elm.edit_bkmk.form.input_tag.input_box.addEventListener(
    "keyup", (e) => UI.AnyPage.handle_keyup_input_tag_box(
        e,
        window.app.tag_exists_db,
        root_elm.edit_bkmk.form.input_tag
    )
)
root_elm.edit_bkmk.form.input_tag.elm.addEventListener(
    "click", () => UI.EditBkmk.focus_input_tag_box(
        root_elm.edit_bkmk.form.input_tag
    )
)