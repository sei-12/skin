
//
// HTML

import { CycleIndex } from "./utils"

//
export type InputTagElms = {
    add: HTMLInputElement,
    home: HTMLInputElement
}
export type AddPageForm = {
    input_url: HTMLInputElement,
    input_title: HTMLInputElement,
    input_description: HTMLInputElement,
    inputed_tags: HTMLElement
}
// export type Pages = {
//     add: HTMLElement,
//     home: HTMLElement,
//     edit: HTMLElement,
//     list: HTMLElement,
// }


type NoticeType = "info" | "warn" | "error"
// export type PAGE_ELM_IDS = "pages:home" | "pages:add" | "pages:edit" | "pages:list" | "pages:taglist"
export type WhenStr = "tag_suggestion"
type Handler = () => void

export class When {
    // ユーザーの設定から変換
    static from_string() {

    }

    page: PageName | "anypage"
    private values: WhenStr[]

    constructor(vals: WhenStr[] | undefined = undefined, page: PageName | "anypage" | undefined = undefined) {
        if (vals === undefined) {
            vals = []
        }

        if (page === undefined) {
            page = "anypage"
        }

        this.values = vals
        this.page = page
    }

    match(cur_page: PageName, when_strs: WhenStr[]): boolean {
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

export class HotkeyMap {
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

    get_hotkey(cur_page: PageName, key_str: string, now: WhenStr[]): Handler | null {
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

export type PageName = "add" | "home" | "edit" | "list" | "taglist"
export type Pages = {
    add: HTMLElement,
    home: HTMLElement,
    edit: HTMLElement,
    list: HTMLElement,
    taglist: HTMLElement,
}

export function get_current_page(parent_elm: HTMLElement): HTMLElement {

    let cur_page: HTMLElement | null = null

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

        cur_page = node
    })

    if (cur_page === null) {
        throw Error("表示されているページが無い")
    }

    console.debug("cur_page_id:", cur_page)

    return cur_page
}

export function get_current_page_name(pages: Pages): PageName | undefined {
    let page_names: PageName[] = ["add","home","edit","list","taglist"]
    return page_names.find( name => pages[name].style.display === "block" )
}


export function move_page(current: PageName, to: "next" | "prev"): PageName {
    let page_names: PageName[] = ["add","home","edit","list","taglist"]

    let current_index = page_names.findIndex(p => p === current)
    if (current_index === -1) {
        console.error("bug")
        current_index = 0
    }
    let ci = new CycleIndex(current_index)
    let next_page_index = to === "next" ? ci.plus(page_names.length) : ci.minus(page_names.length)
    return page_names[next_page_index.val]
}

export function switch_page(from: HTMLElement, to: HTMLElement) {
    from.style.display = "none"
    to.style.display = "block"
}
//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                            STAND ALONE                                             //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
export function create_new_tag_element(tagname: string, exists_db: boolean) {
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

export function clear_add_page_form(form: AddPageForm) {
    form.input_title.value = ""
    form.input_url.value = ""
    form.inputed_tags.innerHTML = ""
    form.input_description.value = ""
}

export function get_inputed_tags(inputed_tags_elm: HTMLElement): string[] {
    let tags: string[] = []
    inputed_tags_elm.childNodes.forEach(child => {
        if (!(child instanceof HTMLElement)) {
            return
        }
        tags.push(child.innerText)
    })
    return tags
}

export function remove_tag_elm_from_inputed(inputed_elm: HTMLElement) {
    let last = inputed_elm.lastElementChild
    if (last === null) {
        return
    }
    inputed_elm.removeChild(last)
}

export function pressKeyStr(e: KeyboardEvent) {
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

export async function complement_info_from_url(form: AddPageForm) {

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

// TODO
export function notice(msg: string, notice_type: NoticeType) {
    console.error("notice is not implement")
    console[notice_type](msg)
}

export async function add_bookmark(form: AddPageForm) {

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

export function is_inputed_tag(inputed_elm: HTMLElement, tag: string) {
    let childNodes = Array.from(inputed_elm.childNodes)
    return childNodes.find(n => n instanceof HTMLElement ? n.innerText === tag : false)
}

export function search_google_for_tags(inputed_elm: HTMLElement) {
    let tags = get_inputed_tags(inputed_elm)
    if (tags.length === 0) {
        return
    }
    window.app.search_google(tags)
}

// export function move_page(pages: Pages, current: PAGE_ELM_IDS, to: "prev" | "next") {
//     const PAGES: PAGE_ELM_IDS[] = ["pages:add", "pages:list", "pages:home", "pages:edit","pages:taglist"]
//     let current_index = PAGES.findIndex(p => p === current)
//     if (current_index === -1) {
//         console.error("bug")
//         current_index = 0
//     }
//     let ci = new CycleIndex(current_index)
//     let next_page_index = to === "next" ? ci.plus(PAGES.length) : ci.minus(PAGES.length)
//     switch_page(pages, current, PAGES[next_page_index.val])
// }

// export function switch_page(pages: Pages, from: PAGE_ELM_IDS, to: PAGE_ELM_IDS) {
//     let old_page = document.getElementById(from)
//     let new_page = document.getElementById(to)

//     if (old_page === null || new_page === null) {
//         console.error("switch_page: bug")
//         return
//     }

//     old_page.style.display = "none"
//     new_page.style.display = "block"
// }

// input_elm.valueを補完しないままinputed_tagsに入れる
export async function insert_tag_not_complement(input_elm: HTMLInputElement, into: HTMLElement) {
    // スペースとコンマを削除
    let tag_name = input_elm.value.replace(" ", "").replace(",", "")

    if (tag_name === "") {
        input_elm.value = ""
        return
    }

    // tag_suggestion_windowが更新されるかどうかが問題
    let exists_db = await window.app.tag_exists_db(tag_name)
    let tag_elm = create_new_tag_element(tag_name, exists_db)

    if (is_inputed_tag(into, tag_name)) {
        notice(`${tag_name} is inputed`, "info")
        input_elm.value = ""
        return
    }
    into.appendChild(tag_elm)
    input_elm.value = ""
}

export function clear_inputed_tags(inputed_elm: HTMLElement) {
    inputed_elm.innerHTML = ""
}


export function focus_input_tag_box(cur_page: PageName, inputElms: InputTagElms) {

    if (cur_page === "add") {
        inputElms.add.focus()
    }
    else if (cur_page === "home") {
        inputElms.home.focus()
    } else {
        return
    }
}
