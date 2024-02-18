import { CycleIndex, scroll_to_focus_elm } from "../utils"

function create_bkmk_list_item_elm(data: BookmarkData) {
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
    let replace_re = new RegExp("-", "g")
    craeted_at_elm.innerText = "created at: " + data.created_at.replace(replace_re, "/")
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

export function insert_searched_bookmarks(bkmks: BookmarkData[], into: SearchedBookmarkListElm) {
    into.focus = null
    let elms = bkmks.map(data => create_bkmk_list_item_elm(data))
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