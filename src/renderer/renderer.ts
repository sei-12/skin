import './index.css';

import { SearchedBookmarkList } from './sub/search_bookmark_list';
import { AddPageForm, HotkeyMap, InputTagElms, PAGE_ELM_IDS, Pages, When, WhenStr, add_bookmark, clear_inputed_tags, complement_info_from_url, create_new_tag_element, focus_input_tag_box, get_inputed_tags, insert_tag_not_complement, is_inputed_tag, move_page, notice, pressKeyStr, remove_tag_elm_from_inputed, search_google_for_tags, switch_page } from './sub/sub';
import { TagSuggestionWindow } from './sub/tag_suggestion_window';

const TAG_SUGGESTION_WINDOW_ID = "tag-suggestion-window"

export async function tag_complement(tag_suggestion_window: TagSuggestionWindow, into: HTMLElement) {

    if (tag_suggestion_window.get_showing_now() === false) {
        console.warn("bug?")
        return
    }
    // TagSuggestionWindowがtargetElmを保持する？
    let input_elm = tag_suggestion_window.target_elm
    if (input_elm === null) {
        console.warn("bug")
        return
    }

    let comp = tag_suggestion_window.done_suggestion()

    if (comp === null) {
        console.warn("comp is null")
        return
    }
    let exists_db = await window.app.tag_exists_db(comp)
    let tag_elm = create_new_tag_element(comp, exists_db)

    if (is_inputed_tag(into, comp)) {
        notice(`${comp} is inputed`, "info")
        return
    }

    into.appendChild(tag_elm)
}

async function update_searched_bookmark_list(bkmk_list: SearchedBookmarkList, inputed_tags_elm: HTMLElement) {
    if (inputed_tags_elm === null) {
        console.error("bug")
        return
    }

    let inputed_tags = get_inputed_tags(inputed_tags_elm)
    let data = await window.app.search_bookmarks(inputed_tags)

    console.log(data)
    bkmk_list.insert(data)
}

// 「巡回」という英語がわからん

/**
 * Main以外からアクセスしてほしくない
 * でもわざわざMainの中にかきたくもない
 */
function html_root() {
    return {
        page_root: document.getElementById("pages")!,

        home_elm: document.getElementById("pages:home")!,
        home: {
            input_tag: <HTMLInputElement>document.getElementById("page-home-input-tags")!,
            inputed_tags: document.getElementById("page-home-inputed-tags")!,
            input_tags_container: document.getElementById("page-home-input-tags-container")!
        },
        add_elm: document.getElementById("pages:add")!,
        add: {
            add_btn: document.getElementById("page-add-done-btn")!,
            input_url: <HTMLInputElement>document.getElementById("page-add-input-url")!,
            input_title: <HTMLInputElement>document.getElementById("page-add-input-title")!,
            input_description: <HTMLInputElement>document.getElementById("page-add-input-description")!,
            inputed_tags: document.getElementById("page-add-inputed-tags")!,
            input_tag: <HTMLInputElement>document.getElementById("page-add-input-tags")!,
            input_tags_container: document.getElementById("page-add-input-tags-container")!
        },

        edit_elm: document.getElementById("pages:edit")!,
        list_elm: document.getElementById("pages:list")!,
    }
}

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                                MAIN                                                //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

function initialize_pages(page_parent: HTMLElement) {
    page_parent.childNodes.forEach(n => {
        if (n instanceof HTMLDivElement) {
            if (n.id == "pages:home") {
                n.style.display = "block"
                return
            }
            n.style.display = "none"
        }
    })
}


namespace Main {
    function main() {
        initialize_pages(root.page_root)
        switch_page(alias_pages, get_display_block_page_id(), "pages:home")

        //----------------------------------------//
        //                ADD PAGE                //
        //----------------------------------------//
        root.add.add_btn.addEventListener("click", UserCommand.u_add_bookmark)
        root.add.input_url.addEventListener("input", () => { complement_info_from_url(alias_add_page_form) })
        root.add.input_tag.addEventListener("input", () => { tag_suggestion_window.handle_input(root.add.input_tag) })

        root.add.input_tag.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && root.add.input_tag.value === "") {
                remove_tag_elm_from_inputed(root.add.inputed_tags)
            }
        })
        root.add.input_tag.addEventListener("keyup", (e) => {
            if (e.key == " " && e.isComposing === false) {
                insert_tag_not_complement(root.add.input_tag, root.add.inputed_tags)
            }
        })
        root.add.input_tags_container.addEventListener("click", () => {
            focus_input_tag_box("pages:add", alias_input_tag_elms)
        })

        hotkey_map.set_hotkey("ctrl+Enter", new When([], "pages:add"), UserCommand.u_add_bookmark)


        //----------------------------------------//
        //               HOME PAGE                //
        //----------------------------------------//
        root.home.input_tag.addEventListener("input", (e) => {
            tag_suggestion_window.handle_input(root.home.input_tag)
        })
        root.home.input_tag.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && root.home.input_tag.value === "") {
                remove_tag_elm_from_inputed(root.home.inputed_tags)
            }
        })
        root.home.input_tag.addEventListener("keyup", (e) => {
            if (e.key == " " && e.isComposing === false) {
                insert_tag_not_complement(root.home.input_tag, root.home.inputed_tags)
            }
        })
        const mo = new MutationObserver(() => {
            update_searched_bookmark_list(searched_bookmark_list, root.home.inputed_tags)
        })
        mo.observe(root.home.inputed_tags, { childList: true })
        root.home.input_tags_container.addEventListener("click", () => {
            focus_input_tag_box("pages:home", alias_input_tag_elms)
        })


        hotkey_map.set_hotkey("ArrowDown", new When([], "pages:home"), UserCommand.u_bkmk_list_focus_down)
        hotkey_map.set_hotkey("ArrowUp", new When([], "pages:home"), UserCommand.u_bkmk_list_focus_up)
        hotkey_map.set_hotkey("Enter", new When([], "pages:home"), UserCommand.u_open_bookmark)
        hotkey_map.set_hotkey("ctrl+Enter", new When([], "pages:home"), UserCommand.u_search_google_for_tags)



        //----------------------------------------//
        //                ANY PAGE                //
        //----------------------------------------//
        window.addEventListener("keydown", hotkey_caller)
        hotkey_map.set_hotkey("ArrowDown", new When(["tag_suggestion"]), UserCommand.tag_suggestion_focus_down)
        hotkey_map.set_hotkey("ArrowUp", new When(["tag_suggestion"]), UserCommand.tag_suggestion_focus_up)
        hotkey_map.set_hotkey("Enter", new When(["tag_suggestion"]), UserCommand.u_tag_complement)


        hotkey_map.set_hotkey("ctrl+l", new When([], "anypage"), UserCommand.next_page)
        hotkey_map.set_hotkey("ctrl+h", new When([], "anypage"), UserCommand.prev_page)

        hotkey_map.set_hotkey("ctrl+/", new When([], "anypage"), UserCommand.u_focus_input_tag_box)
    }

    //
    // ユーザーからの命令があったときに呼ばれる
    // 処理の中身は外に書く。
    // ずっと生きている変数のスコープを小さくするためでもある
    // 
    namespace UserCommand {
        // ラッパーみたいなものだから外の関数と名前がかぶる。
        // 名前がかぶるときは先頭にu_をつけることにする

        export function tag_suggestion_focus_up() {
            tag_suggestion_window.handle_move_focus("up")
        }

        export function tag_suggestion_focus_down() {
            tag_suggestion_window.handle_move_focus("down")
        }

        export async function u_tag_complement() {
            // TODO
            let cur = get_display_block_page_id()
            let into = null
            if (cur === "pages:add") {
                into = root.add.inputed_tags
            }
            if (cur === "pages:home") {
                into = root.home.inputed_tags
            }
            if (cur === null || into === null) {
                return
            }
            tag_complement(tag_suggestion_window, into)
        }

        export function u_add_bookmark() {
            add_bookmark(alias_add_page_form)
        }

        export function u_bkmk_list_focus_down() {
            searched_bookmark_list.move_focus("down")
        }

        export function u_bkmk_list_focus_up() {
            searched_bookmark_list.move_focus("up")
        }

        export function u_open_bookmark() {
            let bkmk_data = searched_bookmark_list.get_focused_item()
            if (bkmk_data === null) {
                return
            }
            clear_inputed_tags(root.home.inputed_tags)
            window.app.open_bookmark(bkmk_data.id)
        }

        export function prev_page() {
            move_page(alias_pages, get_display_block_page_id(), "prev")
        }

        export function next_page() {
            move_page(alias_pages, get_display_block_page_id(), "next")
        }

        export function u_focus_input_tag_box() {
            focus_input_tag_box(get_display_block_page_id(), alias_input_tag_elms)
        }

        export function u_search_google_for_tags() {
            search_google_for_tags(root.home.inputed_tags)
            clear_inputed_tags(root.home.inputed_tags)
        }
    }

    function get_when_strs() {
        let vals: WhenStr[] = []

        if (tag_suggestion_window.get_showing_now()) {
            vals.push("tag_suggestion")
        }

        return vals
    }

    function hotkey_caller(e: KeyboardEvent) {
        let key_str = pressKeyStr(e)
        let when = get_when_strs()
        let cur_page = get_display_block_page_id()
        let handler = hotkey_map.get_hotkey(cur_page, key_str, when)

        if (handler === null) {
            return
        }

        handler()
    }

    /**
     * get_current_page_idという名前でもいい
     * @throws ひとつも表示されていない場合もしくは複数表示されている場合はバグ
     * @returns 
     */
    function get_display_block_page_id(): PAGE_ELM_IDS {
        let parent_elm = document.getElementById("pages")

        if (parent_elm === null) {
            throw Error("bug")
        }

        let cur_page: PAGE_ELM_IDS | null = null

        parent_elm.childNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) {
                return
            }

            if (node.style.display !== "block") {
                return
            }

            if (cur_page !== null) {
                throw Error("複数表示されている")
            }

            cur_page = node.id as PAGE_ELM_IDS
        })

        if (cur_page === null) {
            throw Error("表示されているページが無い")
        }

        console.debug("cur_page_id:", cur_page)

        return cur_page
    }


    const root = html_root()
    const hotkey_map = new HotkeyMap()
    const tag_suggestion_window = new TagSuggestionWindow(
        <HTMLDivElement>document.getElementById(TAG_SUGGESTION_WINDOW_ID)!,
        [
            <HTMLDivElement>document.getElementById(
                "inner-" + TAG_SUGGESTION_WINDOW_ID + "0"
            ),
            <HTMLDivElement>document.getElementById(
                "inner-" + TAG_SUGGESTION_WINDOW_ID + "1"
            ),
        ]
    )
    const searched_bookmark_list = new SearchedBookmarkList(
        <HTMLDivElement>document.getElementById("page-home-search-results")
    )

    const alias_input_tag_elms: InputTagElms = {
        add: root.add.input_tag,
        home: root.home.input_tag
    }

    const alias_add_page_form: AddPageForm = {
        input_url: root.add.input_url,
        input_title: root.add.input_title,
        input_description: root.add.input_description,
        inputed_tags: root.add.inputed_tags
    }

    const alias_pages: Pages = {
        add: root.add_elm,
        home: root.home_elm,
        edit: root.edit_elm,
        list: root.list_elm
    }

    main()
}