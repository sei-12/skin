import { CycleIndex, scroll_to_focus_elm } from "../utils"

function create_bkmk_list_item_elm(
    data: BookmarkData,
    handle_click_edit_bkmk: (data:BookmarkData) => void,
    handle_click_delete_bkmk: (data:BookmarkData) => void
) {
    let data_elm = document.createElement("div")
    data_elm.innerText = JSON.stringify(data)
    data_elm.classList.add("data")
    data_elm.style.display = "none"

    let layout_top = document.createElement("div")
    layout_top.classList.add("bookmark-list-item-layout-top")

    let title_elm = document.createElement("div")
    title_elm.innerText = data.title
    title_elm.classList.add("bookmark-list-item-title")

    let description_elm = document.createElement("div")
    description_elm.innerText = data.description
    description_elm.classList.add("bookmark-list-item-desc")

    let craeted_at_elm = document.createElement("div")
    let replace_re = new RegExp("-", "g")
    craeted_at_elm.innerText = "created at: " + data.created_at.replace(replace_re, "/")
    craeted_at_elm.classList.add("bookmark-list-item-created-at")


    let edit_button = document.createElement("button")
    edit_button.addEventListener("click",() => handle_click_edit_bkmk(data))
    edit_button.classList.add("bookmark-list-item-icon-button")
    let edit_icon = document.createElement("i")
    edit_icon.classList.add("nf")
    edit_icon.innerText = "\udb82\udd0c"
    edit_button.appendChild(edit_icon)


    let delete_button = document.createElement("button")
    delete_button.classList.add("bookmark-list-item-icon-button")
    delete_button.addEventListener("click",() => handle_click_delete_bkmk(data))
    let delete_icon = document.createElement("i")
    delete_icon.classList.add("nf")
    delete_icon.innerText = "\udb82\udde7"
    delete_button.appendChild(delete_icon)


    let div = document.createElement("div")
    div.classList.add("bookmark-list-item-container")
    layout_top.appendChild(title_elm)
    layout_top.appendChild(edit_button)
    layout_top.appendChild(delete_button)

    div.appendChild(layout_top)
    div.appendChild(craeted_at_elm)
    div.appendChild(description_elm)
    // TODO
    div.appendChild(data_elm)
    return div
}

function bkmk_data_from_bkmk_elm(elm: HTMLElement): BookmarkData {

    let divs = elm.querySelectorAll("div")
    let divs_ary = Array.from(divs)
    let inner = divs_ary.find(e => e.classList.contains("data"))

    if (inner === undefined) {
        throw Error("bug")
    }

    let parsed = JSON.parse(inner.innerText)

    return parsed
}

export class SearchedBookmarkListElm {
    focus: CycleIndex | null
    elm: HTMLElement
    constructor() {
        this.elm = document.createElement("div")
        this.elm.classList.add("searched-bkmks")

        this.focus = null
    }
}

export function get_focued_elm_or_first_elm(elm: SearchedBookmarkListElm): BookmarkData | null {
    if (elm.elm.childNodes.length === 0) {
        return null
    }

    let target_index = elm.focus?.val
    if (target_index === undefined) target_index = 0
    let target_elm = elm.elm.childNodes[target_index]
    if (!(target_elm instanceof HTMLElement)) {
        return null
    }

    return bkmk_data_from_bkmk_elm(target_elm)
}

export function insert_searched_bookmarks(
    bkmks: BookmarkData[],
    into: SearchedBookmarkListElm,
    handle_click_edit_bkmk: (data:BookmarkData) => void,
    handle_click_delete_bkmk: (data:BookmarkData) => void
) {
    into.focus = null
    let elms = bkmks.map(data => create_bkmk_list_item_elm(
        data,
        handle_click_edit_bkmk,
        handle_click_delete_bkmk
    ))
    into.elm.innerHTML = ""
    elms.forEach(elm => {
        into.elm.appendChild(elm)
    })
}

export function move_focus_searched_bookmarks(to: "up" | "down", elm: SearchedBookmarkListElm) {
    if (elm.elm.childNodes.length === 0) {
        return
    }

    if (elm.focus !== null) {
        let current_elm = elm.elm.childNodes[elm.focus.val]
        if (!(current_elm instanceof HTMLElement)) {
            return new Error("bug")
        }

        if (current_elm === undefined) {
            return new Error("TODO")
        }

        current_elm.classList.remove("bookmark-list-item-container-focus")
    }

    let next: CycleIndex
    if (elm.focus === null) {
        next = new CycleIndex(0)
    } else {
        if (to === "down") {
            next = elm.focus.plus(elm.elm.childNodes.length)
        } else {
            next = elm.focus.minus(elm.elm.childNodes.length)
        }

    }

    let next_elm = elm.elm.childNodes[next.val]

    if (next_elm === undefined || !(next_elm instanceof HTMLElement)) {
        return
    }

    next_elm.classList.add("bookmark-list-item-container-focus")

    scroll_to_focus_elm(
        next_elm,
        elm.elm
    )

    elm.focus = next
}