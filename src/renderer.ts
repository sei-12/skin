/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                               CONST                                                //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
const TAG_SUGGESTION_WINDOW_ID = "tag-suggestion-window"
const SUGGESTION_WINDOW_ID = "tag-suggestion-window"

type WhenStr = "tag_suggestion"
type Handler = () => void
type NoticeType = "info" | "warn" | "error"
type PAGE_ELM_IDS = "pages:home" | "pages:add" | "pages:edit" | "pages:list"


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                               CLASS                                                //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

class When {
    // ユーザーの設定から変換
    static from_string() {

    }

    page: PAGE_ELM_IDS | "anypage"
    private values: WhenStr[]

    constructor(vals: WhenStr[] | undefined = undefined, page: PAGE_ELM_IDS | "anypage" | undefined = undefined) {
        if (vals === undefined) {
            vals = []
        }

        if (page === undefined) {
            page = "anypage"
        }

        this.values = vals
        this.page = page
    }

    match(cur_page: PAGE_ELM_IDS, when_strs: WhenStr[]): boolean {
        if (this.page !== "anypage" && this.page !== cur_page) {
            return false
        }

        if (!this.values.every(v => when_strs.includes(v))) {
            return false
        }

        if (this.values.length !== when_strs.length) {
            return false
        }

        return true
    }
}


class CycleIndex {
    val: number

    constructor(val: number) {
        this.val = val
    }

    plus(len: number) {
        let next = this.val + 1
        if (next >= len) {
            next = 0
        }
        return new CycleIndex(next)
    }

    minus(len: number) {
        let next = this.val - 1
        if (next < 0) {
            next = len - 1
        }
        return new CycleIndex(next)
    }
}


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                       SEARCHED BOOKMARK LIST                                       //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
type SearchedBookmarkItem = {
    title: string,
    id: number,
    url: string,
    description: string
}

function create_new_bookmark_elm(data: SearchedBookmarkItem) {
    let data_elm = document.createElement("div")
    data_elm.innerText = JSON.stringify(data)
    data_elm.classList.add("data")
    data_elm.style.display = "none"

    let title_elm = document.createElement("div")
    title_elm.innerText = data.title
    title_elm.classList.add("bookmark-list-item-title")

    let description_elm = document.createElement("div")
    description_elm.innerText = data.description
    description_elm.classList.add("bookmark-list-item-desc")

    let div = document.createElement("div")
    div.classList.add("bookmark-list-item-container")
    div.appendChild(title_elm)
    div.appendChild(description_elm)
    // TODO
    div.appendChild(data_elm)
    return div
}

function create_new_bkmklist_sep() {
    let div = document.createElement("div")
    div.innerText = "---".repeat(10)
    return div
}

function bkmk_data_from_bkmk_elm(elm: HTMLDivElement): SearchedBookmarkItem {

    let divs = elm.querySelectorAll("div")
    let divs_ary = Array.from(divs)
    let inner = divs_ary.find(e => e.classList.contains("data"))

    if (inner === undefined) {
        throw Error("bug")
    }

    let parsed = JSON.parse(inner.innerText)

    return parsed
}

class SearchedBookmarkList {
    static MAX_LENGTH = 100
    private elm: HTMLDivElement
    private focus_index: CycleIndex | null

    constructor() {
        this.elm = <HTMLDivElement>document.getElementById("page-home-search-results")!
        this.focus_index = null
    }

    move_focus(to: "up" | "down") {

        let len = this.elm.childNodes.length

        if (len === 0) {
            return
        }

        let old = this.focus_index

        if (this.focus_index !== null) {
            this.focus_index = to == "down" ? this.focus_index.plus(len) : this.focus_index.minus(len)
        } else {
            this.focus_index = new CycleIndex(0)
        }

        this.update_elm_focus_css(
            old?.val ?? null,
            this.focus_index?.val ?? null
        )
    }

    private update_elm_focus_css(old: null | number, next: null | number) {

        if (next !== null) {
            let f = this.elm.childNodes[next]

            if (f instanceof HTMLElement) {
                f.classList.add("bookmark-list-item-container-focus")
            }
        }

        if (next === old) {
            return
        }

        if (old !== null) {
            let unf = this.elm.childNodes[old]

            if (unf instanceof HTMLElement) {
                unf.classList.remove("bookmark-list-item-container-focus")
            }
        }

    }

    get_focused_item() {
        if (this.focus_index === null && this.elm.childNodes.length === 0) {
            return null
        }

        // フォーカスがnullでも要素が一個以上あるなら一個目を返す
        // 処理が複雑になってきたとかんじてから関数を分ける
        let index = this.focus_index?.val ?? 0

        let c = this.elm.childNodes[index]
        if (!(c instanceof HTMLDivElement)) {
            console.error("bug")
            return null
        }

        return bkmk_data_from_bkmk_elm(c)
    }

    insert(datas: SearchedBookmarkItem[]) {
        // この処理がおもたいなら要素を２つ用いて切り替えながら表示する
        this.elm.innerHTML = ""

        this.update_elm_focus_css(this.focus_index ? this.focus_index.val : null, null)
        this.focus_index = null


        datas.forEach(d => {
            this.elm.prepend(create_new_bookmark_elm(d))
        })
    }
}
// <<<< Search Bookmark List


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                       TAG SUGGESTION WINDOW                                        //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

namespace TagSuggestion {

    export function switch_and_update_inner(inners: HTMLDivElement[], new_items: HTMLDivElement[]) {
        let cur_index = inners.findIndex(e => e.style.display === "block")
        if (cur_index === -1) {
            cur_index = 0
        }
        let next_index = new CycleIndex(cur_index).plus(inners.length).val

        new_items.forEach(w => {
            inners[next_index].appendChild(w)
        })

        inners[next_index].style.display = "block"
        inners[cur_index].style.display = "none"
        inners[cur_index].innerHTML = ""
        cur_index = next_index
    }
}


class TagSuggestionWindow {
    inners: HTMLDivElement[]
    elm: HTMLDivElement
    showing_now: boolean
    suggestion_items: HTMLDivElement[]
    focus_index: CycleIndex
    target_elm: HTMLInputElement | null

    constructor() {
        this.inners = [
            <HTMLDivElement>document.getElementById(
                "inner-" + TAG_SUGGESTION_WINDOW_ID + "0"
            ),
            <HTMLDivElement>document.getElementById(
                "inner-" + TAG_SUGGESTION_WINDOW_ID + "1"
            ),
        ]

        this.elm = <HTMLDivElement>document.getElementById(TAG_SUGGESTION_WINDOW_ID)
        this.showing_now = false
        this.focus_index = new CycleIndex(0)
        this.suggestion_items = []
        this.target_elm = null

        //
        // initialize
        // 
        this.elm.style.display = "none"
    }

    get_showing_now() {
        // 外部から書き込みできないようにするため
        // わざわざ関数を作る必要があるのかどうかはわからん
        return this.showing_now
    }


    async update(find_word: string) {
        this.focus_index = new CycleIndex(0)
        let datas = await window.app.fetch_suggestion(find_word)
        this.suggestion_items = datas.data.map(d => create_suggestion_list_item(find_word,d.name))
        TagSuggestion.switch_and_update_inner(this.inners, this.suggestion_items)
        if (this.suggestion_items.length === 0) {
            return
        }
        this.suggestion_items[this.focus_index.val].classList.add("suggestion-item-focus")
    }


    handle_move_focus(to: "up" | "down") {
        let new_index

        if (to == "down") {
            new_index = this.focus_index.plus(this.suggestion_items.length)
        } else {
            new_index = this.focus_index.minus(this.suggestion_items.length)
        }

        this.suggestion_items[this.focus_index.val].classList.remove("suggestion-item-focus")
        this.suggestion_items[new_index.val].classList.add("suggestion-item-focus")

        // divにフォーカスしてもスクロールされるかわからん
        // TODO

        this.suggestion_items[new_index.val].focus()

        this.focus_index = new_index
    }

    /**
     * InputElementのvalueに対して変更を加えている!!
     * 内部でウィンドウを終了させている
     * 
     * @returns 
     */
    done_suggestion(): string | null {
        if (this.showing_now === false || this.target_elm === null) {
            console.error("bug: showing_now=", this.showing_now, "target_elm:", this.target_elm)
            return null
        }

        this.target_elm.value = ""
        let suggestion = this.suggestion_items[this.focus_index.val].innerText
        this.exit()
        return suggestion
    }

    async handle_input(elm: HTMLInputElement) {
        let val = elm.value
        if (this.showing_now && val !== "") {
            await this.update(val)
            if (this.suggestion_items.length === 0) {
                this.exit()
            }
            return
        }

        if (this.showing_now && val === "") {
            this.exit()
            return
        }

        if (val === "") {
            return
        }

        await this.update(val)

        if (this.suggestion_items.length > 0) {
            this.show()
            this.target_elm = elm
            this.move_to_under_input_elm(elm)
        }
    }

    move_to_under_input_elm(input_elm: HTMLInputElement) {
        let input_elm_bottom = input_elm.offsetTop + input_elm.offsetHeight
        this.elm.style.top = input_elm_bottom + "px"
        this.elm.style.left = input_elm.offsetLeft + "px"
    }

    show() {
        this.showing_now = true
        document.getElementById(SUGGESTION_WINDOW_ID)!.style.display = "block"
    }

    exit() {
        this.focus_index = new CycleIndex(0)
        this.suggestion_items = []
        this.target_elm = null
        this.showing_now = false
        document.getElementById(SUGGESTION_WINDOW_ID)!.style.display = "none"
    }
}

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                             HOTKEY MAP                                             //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
class HotkeyMap {
    keydownHotkeyMap: {
        [key: string]: {
            when: When,
            handler: Handler
        }[]
    }

    constructor() {
        this.keydownHotkeyMap = {}
    }

    set_hotkey(key_str: string, when: When, handler: () => void) {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            this.keydownHotkeyMap[key_str] = []
        }

        this.keydownHotkeyMap[key_str].push({ when, handler })
    }

    get_hotkey(cur_page: PAGE_ELM_IDS, key_str: string, now: WhenStr[]): Handler | null {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            return null
        }

        let matched = this.keydownHotkeyMap[key_str].find(v => {
            return v.when.match(cur_page, now)
        })

        if (matched === undefined) {
            return null
        }

        return matched.handler
    }
}


function create_new_tag_element(tagname: string, exists_db: boolean) {
    let elm = document.createElement("div")
    elm.innerText = tagname
    elm.classList.add("tag")
    if (exists_db) {
        elm.classList.add("tag-exists-db")
    } else {
        elm.classList.add("tag-not-exists-db")
    }
    return elm
}

function initialize_pages() {
    let p = document.getElementById("pages")
    p?.childNodes.forEach(n => {
        if (n instanceof HTMLDivElement) {
            if (n.id == "pages:home") {
                n.style.display = "block"
                return
            }
            n.style.display = "none"
        }
    })
}

function switch_page(from: PAGE_ELM_IDS, to: PAGE_ELM_IDS) {
    let old_page = document.getElementById(from)
    let new_page = document.getElementById(to)

    if (old_page === null || new_page === null) {
        console.error("switch_page: bug")
        return
    }

    old_page.style.display = "none"
    new_page.style.display = "block"
}

function get_inputed_tags(inputed_tags_elm: HTMLElement): string[] {
    let tags: string[] = []
    inputed_tags_elm.childNodes.forEach(child => {
        if (!(child instanceof HTMLElement)) {
            return
        }
        tags.push(child.innerText)
    })
    return tags
}

// TODO
function notice(msg: string, notice_type: NoticeType) {
    console.error("notice is not implement")
    console[notice_type](msg)
}

function create_suggestion_list_item(find_word:string,word: string) {
    let html = `<span class="suggestion-item-match-str">${find_word}</span>`
    let div = document.createElement("div")
    word = word.replace(find_word,html)
    div.innerHTML = word
    div.classList.add("suggestion-item")
    return div
}


function pressKeyStr(e: KeyboardEvent) {
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


// TODO rename
// intoというより、対応付けされている。削除のときにも使うし、
function tag_into_elm_id(input_elm_id: string) {
    const map: { [key: string]: string } = {
        "page-add-input-tags": "page-add-inputed-tags",
        "page-home-input-tags": "page-home-inputed-tags",
    }

    let into_elm_id = map[input_elm_id]

    if (into_elm_id === undefined) {
        throw Error(`bug: input_elm_id=${input_elm_id}`)
    }

    return into_elm_id
}

function remove_tag_elm_from_inputed(input_elm_id: string) {
    let target_elm_id = tag_into_elm_id(input_elm_id)
    let target_elm = document.getElementById(target_elm_id)!
    let last = target_elm.lastElementChild

    if (last === null) {
        return
    }

    target_elm.removeChild(last)
}

async function tag_complement(tag_suggestion_window: TagSuggestionWindow) {

    if (tag_suggestion_window.get_showing_now() === false) {
        // HotkeyのWhenの設定が間違っている可能性あり
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


    let target_elm_id = tag_into_elm_id(input_elm.id)
    let target_elm = document.getElementById(target_elm_id)!
    target_elm.appendChild(tag_elm)
}

function clear_add_page_form() {
    let input_url = <HTMLInputElement>document.getElementById("page-add-input-url")
    let input_title = <HTMLInputElement>document.getElementById("page-add-input-title")
    let inputed_tags = document.getElementById("page-add-inputed-tags")
    let input_description = <HTMLInputElement>document.getElementById("page-add-input-description")

    if (input_url === null || input_title === null || inputed_tags === null || input_description === null) {
        console.error("bug")
        return
    }

    input_title.value = ""
    input_url.value = ""
    inputed_tags.innerHTML = ""
    input_description.value = ""
}

async function add_bookmark() {
    let input_url = <HTMLInputElement>document.getElementById("page-add-input-url")
    let input_title = <HTMLInputElement>document.getElementById("page-add-input-title")
    let input_description = <HTMLInputElement>document.getElementById("page-add-input-description")
    let inputed_tags = document.getElementById("page-add-inputed-tags")

    if (input_url === null || input_title === null || inputed_tags === null || input_description === null) {
        console.error("bug")
        return
    }

    let url = input_url.value
    let title = input_title.value

    let description = input_description.value
    console.log(description)

    let tags = get_inputed_tags(inputed_tags)

    if (url === "" || title === "" || tags.length === 0) {
        // TODO message
        return
    }

    let result = await window.app.add_bookmark(url, title, tags, description)


    if (result.err) {
        notice(result.message, "error")
        return
    }

    notice("complete!", "info")
    clear_add_page_form()
}

async function complement_info_from_url() {
    let input_url = <HTMLInputElement>document.getElementById("page-add-input-url")
    let input_title = <HTMLInputElement>document.getElementById("page-add-input-title")
    let input_description = <HTMLInputElement>document.getElementById("page-add-input-description")

    if (input_url === null || input_title === null || input_description === null) {
        console.error("bug")
        return
    }

    let url = input_url.value
    let pageinfo = await window.app.fetch_pageinfo(url)

    if (pageinfo === null) {
        return
    }

    if (pageinfo.title !== null && input_title.value === "") {
        input_title.value = pageinfo.title
    }

    console.log(pageinfo.description)
    if (pageinfo.description !== null && input_description.value === "") {
        input_description.value = pageinfo.description
    }

}

// 「巡回」という英語がわからん
function move_page(current: PAGE_ELM_IDS, to: "prev" | "next") {
    const PAGES: PAGE_ELM_IDS[] = ["pages:add", "pages:list", "pages:home", "pages:edit"]
    let current_index = PAGES.findIndex(p => p === current)
    if (current_index === -1) {
        console.error("bug")
        current_index = 0
    }
    let ci = new CycleIndex(current_index)
    let next_page_index = to === "next" ? ci.plus(PAGES.length) : ci.minus(PAGES.length)
    switch_page(current, PAGES[next_page_index.val])
}

// input_elm.valueを補完しないままinputed_tagsに入れる
async function insert_tag_not_complement(input_elm: HTMLInputElement) {
    // スペースとコンマを削除
    let tag_name = input_elm.value.replace(" ", "").replace(",", "")

    if (tag_name === "") {
        input_elm.value = ""
        return
    }

    // tag_suggestion_windowが更新されるかどうかが問題
    let exists_db = await window.app.tag_exists_db(tag_name)
    let tag_elm = create_new_tag_element(tag_name, exists_db)

    let target_elm_id = tag_into_elm_id(input_elm.id)
    let target_elm = document.getElementById(target_elm_id)!
    target_elm.appendChild(tag_elm)
    input_elm.value = ""
}

async function update_searched_bookmark_list(bkmk_list: SearchedBookmarkList) {
    let inputed_tags_elm = document.getElementById("page-home-inputed-tags")
    if (inputed_tags_elm === null) {
        console.error("bug")
        return
    }

    let inputed_tags = get_inputed_tags(inputed_tags_elm)
    let data = await window.app.search_bookmarks(inputed_tags)

    console.log(data)
    bkmk_list.insert(data)
}

function focus_input_tag_box(cur_page: PAGE_ELM_IDS) {
    let elm: HTMLInputElement

    if (cur_page === "pages:add") {
        elm = <HTMLInputElement>document.getElementById("page-add-input-tags")
    }
    else if (cur_page === "pages:home") {
        elm = <HTMLInputElement>document.getElementById("page-home-input-tags")
    } else {
        return
    }

    if (elm === null) {
        console.error("bug")
    }

    elm.focus()
}

function search_google_for_tags() {
    let inputed_elm = document.getElementById("page-home-inputed-tags")!
    let tags = get_inputed_tags(inputed_elm)
    if (tags.length === 0) {
        return
    }
    window.app.search_google(tags)
}

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                                MAIN                                                //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

namespace Main {
    function main() {
        initialize_pages()
        switch_page(get_display_block_page_id(), "pages:home")

        //----------------------------------------//
        //                ADD PAGE                //
        //----------------------------------------//
        const page_add_input_tags_elm = <HTMLInputElement>document.getElementById("page-add-input-tags")
        if (page_add_input_tags_elm === null) {
            return
        }

        document.getElementById("page-add-done-btn")?.addEventListener("click", add_bookmark)
        document.getElementById("page-add-input-url")?.addEventListener("input", complement_info_from_url)


        page_add_input_tags_elm.addEventListener("input", (e) => {
            tag_suggestion_window.handle_input(page_add_input_tags_elm)
        })
        page_add_input_tags_elm.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && page_add_input_tags_elm.value === "") {
                remove_tag_elm_from_inputed(page_add_input_tags_elm.id)
            }
        })
        page_add_input_tags_elm.addEventListener("keyup", (e) => {
            if (e.key == " " && e.isComposing === false) {
                insert_tag_not_complement(page_add_input_tags_elm)
            }
        })

        document.getElementById("page-add-input-tags-container").addEventListener("click", () => {
            focus_input_tag_box("pages:add")
        })

        //----------------------------------------//
        //               HOME PAGE                //
        //----------------------------------------//
        const page_home_inputed_elm = <HTMLDivElement>document.getElementById("page-home-inputed-tags")
        const page_home_input_tags_elm = <HTMLInputElement>document.getElementById("page-home-input-tags")
        page_home_input_tags_elm.addEventListener("input", (e) => {
            tag_suggestion_window.handle_input(page_home_input_tags_elm)
        })
        page_home_input_tags_elm.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && page_home_input_tags_elm.value === "") {
                remove_tag_elm_from_inputed(page_home_input_tags_elm.id)
            }
        })
        page_home_input_tags_elm.addEventListener("keyup", (e) => {
            if (e.key == " " && e.isComposing === false ) {
                insert_tag_not_complement(page_home_input_tags_elm)
            }
        })
        const mo = new MutationObserver(() => {
            update_searched_bookmark_list(searched_bookmark_list)
        })
        mo.observe(page_home_inputed_elm, { childList: true })
        document.getElementById("page-home-input-tags-container").addEventListener("click", () => {
            focus_input_tag_box("pages:home")
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
            tag_complement(tag_suggestion_window)
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
            window.app.open_bookmark(bkmk_data.id)
        }

        export function prev_page() {
            move_page(get_display_block_page_id(), "prev")
        }

        export function next_page() {
            move_page(get_display_block_page_id(), "next")
        }

        export function u_focus_input_tag_box() {
            focus_input_tag_box(get_display_block_page_id())
        }

        export function u_search_google_for_tags() {
            search_google_for_tags()
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
    const hotkey_map = new HotkeyMap()
    const tag_suggestion_window = new TagSuggestionWindow()
    const searched_bookmark_list = new SearchedBookmarkList()
    main()
}