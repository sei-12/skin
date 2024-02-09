/** * This file will automatically be loaded by webpack and run in the "renderer" context.
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
import { CycleIndex } from './sub/sub';

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

//
// HTML
//
type InputTagElms = {
    add: HTMLInputElement,
    home: HTMLInputElement
}
type AddPageForm = {
    input_url: HTMLInputElement,
    input_title: HTMLInputElement,
    input_description: HTMLInputElement,
    inputed_tags: HTMLElement
}
type Pages = {
    add: HTMLElement,
    home: HTMLElement,
    edit: HTMLElement,
    list: HTMLElement,
}


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




//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                       SEARCHED BOOKMARK LIST                                       //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

function create_new_bookmark_elm(data: BookmarkData) {
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

    let craeted_at_elm = document.createElement("div")
    let replace_re = new RegExp("-","g")
    craeted_at_elm.innerText = "created at: " + data.created_at.replace(replace_re,"/")
    craeted_at_elm.classList.add("bookmark-list-item-created-at")

    let div = document.createElement("div")
    div.classList.add("bookmark-list-item-container")
    div.appendChild(title_elm)
    div.appendChild(craeted_at_elm)
    div.appendChild(description_elm)
    // TODO
    div.appendChild(data_elm)
    return div
}

function bkmk_data_from_bkmk_elm(elm: HTMLDivElement): BookmarkData {

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

    constructor(elm: HTMLDivElement) {
        this.elm = elm
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

    insert(datas: BookmarkData[]) {
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
        this.suggestion_items = datas.data.map(d => create_suggestion_list_item(find_word,d))
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
        this.elm.style.display = "block"
    }

    exit() {
        this.focus_index = new CycleIndex(0)
        this.suggestion_items = []
        this.target_elm = null
        this.showing_now = false
        this.elm.style.display = "none"
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

function create_suggestion_list_item(find_word:string,tag_data: TagData) {
    let div = document.createElement("div")
    let re = new RegExp(find_word,"i")
    let match_str = tag_data.name.match(re)[0]
    let html = `<span class="suggestion-item-match-str">${match_str}</span>`
    let name = tag_data.name.replace(re,html)
    div.innerHTML = name
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


function remove_tag_elm_from_inputed(inputed_elm: HTMLElement) {
    let last = inputed_elm.lastElementChild
    if (last === null) {
        return
    }
    inputed_elm.removeChild(last)
}

async function tag_complement(tag_suggestion_window: TagSuggestionWindow,into: HTMLElement) {

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

    if( is_inputed_tag(into,comp)){
        notice(`${comp} is inputed`,"info")
        return
    }
    
    into.appendChild(tag_elm)
}

function clear_add_page_form(form: AddPageForm) {
    form.input_title.value = ""
    form.input_url.value = ""
    form.inputed_tags.innerHTML = ""
    form.input_description.value = ""
}

async function add_bookmark(form: AddPageForm) {

    let url = form.input_url.value
    let title = form.input_title.value

    let description = form.input_description.value
    console.log(description)

    let tags = get_inputed_tags(form.inputed_tags)

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
    clear_add_page_form(form)
}

async function complement_info_from_url(form: AddPageForm) {

    let url = form.input_url.value
    let pageinfo = await window.app.fetch_pageinfo(url)

    if (pageinfo === null) {
        return
    }

    if (pageinfo.title !== null && form.input_title.value === "") {
        form.input_title.value = pageinfo.title
    }

    console.log(pageinfo.description)
    if (pageinfo.description !== null && form.input_description.value === "") {
        form.input_description.value = pageinfo.description
    }

}

// 「巡回」という英語がわからん
function move_page(pages: Pages,current: PAGE_ELM_IDS, to: "prev" | "next") {
    const PAGES: PAGE_ELM_IDS[] = ["pages:add", "pages:list", "pages:home", "pages:edit"]
    let current_index = PAGES.findIndex(p => p === current)
    if (current_index === -1) {
        console.error("bug")
        current_index = 0
    }
    let ci = new CycleIndex(current_index)
    let next_page_index = to === "next" ? ci.plus(PAGES.length) : ci.minus(PAGES.length)
    switch_page(pages,current, PAGES[next_page_index.val])
}

function switch_page(pages: Pages,from: PAGE_ELM_IDS, to: PAGE_ELM_IDS) {
    let old_page = document.getElementById(from)
    let new_page = document.getElementById(to)

    if (old_page === null || new_page === null) {
        console.error("switch_page: bug")
        return
    }

    old_page.style.display = "none"
    new_page.style.display = "block"
}

// input_elm.valueを補完しないままinputed_tagsに入れる
async function insert_tag_not_complement(input_elm: HTMLInputElement,into: HTMLElement) {
    // スペースとコンマを削除
    let tag_name = input_elm.value.replace(" ", "").replace(",", "")

    if (tag_name === "") {
        input_elm.value = ""
        return
    }

    // tag_suggestion_windowが更新されるかどうかが問題
    let exists_db = await window.app.tag_exists_db(tag_name)
    let tag_elm = create_new_tag_element(tag_name, exists_db)

    if( is_inputed_tag(into,tag_name)){
        notice(`${tag_name} is inputed`,"info")
        input_elm.value = ""
        return
    }
    into.appendChild(tag_elm)
    input_elm.value = ""
}

function clear_inputed_tags(inputed_elm: HTMLElement){
    inputed_elm.innerHTML = ""
}

async function update_searched_bookmark_list(bkmk_list: SearchedBookmarkList,inputed_tags_elm:HTMLElement) {
    if (inputed_tags_elm === null) {
        console.error("bug")
        return
    }

    let inputed_tags = get_inputed_tags(inputed_tags_elm)
    let data = await window.app.search_bookmarks(inputed_tags)

    console.log(data)
    bkmk_list.insert(data)
}

function focus_input_tag_box(cur_page: PAGE_ELM_IDS,inputElms:InputTagElms) {

    if (cur_page === "pages:add") {
        inputElms.add.focus()
    }
    else if (cur_page === "pages:home") {
        inputElms.home.focus()
    } else {
        return
    }
}

function is_inputed_tag(inputed_elm:HTMLElement,tag:string){
    let childNodes = Array.from(inputed_elm.childNodes)
    return childNodes.find( n => n instanceof HTMLElement ? n.innerText === tag : false )
}

function search_google_for_tags(inputed_elm:HTMLElement) {
    let tags = get_inputed_tags(inputed_elm)
    if (tags.length === 0) {
        return
    }
    window.app.search_google(tags)
}

/**
 * Main以外からアクセスしてほしくない
 * でもわざわざMainの中にかきたくもない
 */
function html_root(){
    return {
        page_root: document.getElementById("pages"),

        home_elm: document.getElementById("pages:home"),
        home: {
            input_tag:  <HTMLInputElement>document.getElementById("page-home-input-tags")!,
            inputed_tags: document.getElementById("page-home-inputed-tags")!,
            input_tags_container: document.getElementById("page-home-input-tags-container")
        },
        add_elm: document.getElementById("pages:add"),
        add: {
            add_btn: document.getElementById("page-add-done-btn")!,
            input_url: <HTMLInputElement>document.getElementById("page-add-input-url")!,
            input_title: <HTMLInputElement>document.getElementById("page-add-input-title")!,
            input_description: <HTMLInputElement>document.getElementById("page-add-input-description")!,
            inputed_tags: document.getElementById("page-add-inputed-tags")!,
            input_tag:  <HTMLInputElement>document.getElementById("page-add-input-tags")!,
            input_tags_container: document.getElementById("page-add-input-tags-container")
        },

        edit_elm: document.getElementById("pages:edit"),
        list_elm: document.getElementById("pages:list"),
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
        switch_page(alias_pages,get_display_block_page_id(), "pages:home")

        //----------------------------------------//
        //                ADD PAGE                //
        //----------------------------------------//
        root.add.add_btn.addEventListener("click", UserCommand.u_add_bookmark )
        root.add.input_url.addEventListener("input", () => { complement_info_from_url(alias_add_page_form) })
        root.add.input_tag.addEventListener("input", () => { tag_suggestion_window.handle_input(root.add.input_tag) })

        root.add.input_tag.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && root.add.input_tag.value === "") {
                remove_tag_elm_from_inputed(root.add.inputed_tags)
            }
        })
        root.add.input_tag.addEventListener("keyup", (e) => {
            if (e.key == " " && e.isComposing === false) {
                insert_tag_not_complement(root.add.input_tag,root.add.inputed_tags)
            }
        })
        root.add.input_tags_container.addEventListener("click", () => {
            focus_input_tag_box("pages:add",alias_input_tag_elms)
        })

        hotkey_map.set_hotkey("ctrl+Enter", new When([],"pages:add"), UserCommand.u_add_bookmark )


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
            if (e.key == " " && e.isComposing === false ) {
                insert_tag_not_complement(root.home.input_tag,root.home.inputed_tags)
            }
        })
        const mo = new MutationObserver(() => {
            update_searched_bookmark_list(searched_bookmark_list,root.home.inputed_tags)
        })
        mo.observe(root.home.inputed_tags, { childList: true })
        root.home.input_tags_container.addEventListener("click", () => {
            focus_input_tag_box("pages:home",alias_input_tag_elms)
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
            if(cur === "pages:add"){
                into = root.add.inputed_tags
            }
            if(cur === "pages:home"){
                into = root.home.inputed_tags
            }
            if(cur === null){
                return
            }
            tag_complement(tag_suggestion_window,into)
        }

        export function u_add_bookmark(){
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
            move_page(alias_pages,get_display_block_page_id(), "prev")
        }

        export function next_page() {
            move_page(alias_pages,get_display_block_page_id(), "next")
        }

        export function u_focus_input_tag_box() {
            focus_input_tag_box(get_display_block_page_id(),alias_input_tag_elms)
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
    const tag_suggestion_window = new TagSuggestionWindow()
    const searched_bookmark_list = new SearchedBookmarkList(
        <HTMLDivElement>document.getElementById("page-home-search-results")
    )

    const alias_input_tag_elms : InputTagElms = {
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