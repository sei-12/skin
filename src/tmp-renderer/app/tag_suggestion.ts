import { CycleIndex, scroll_to_focus_elm } from "../utils"

function create_suggestion_list_item(find_word: string, tag_data: TagData): HTMLDivElement {
    let div = document.createElement("div")
    let re = new RegExp(find_word, "i")
    let match_str = tag_data.name.match(re)

    let name = ""

    if (match_str !== null) {
        let html = `<span class="suggestion-item-match-str">${match_str}</span>`
        name = tag_data.name.replace(re, html)
    } else {
        name = `<span class="suggestion-item-match-str">${tag_data.name}</span>`
    }

    div.innerHTML = name
    div.classList.add("suggestion-item")
    return div
}

function find_current_inner(win: TagSuggestionWindowElm) {
    return win.inners.find(elm => elm.style.display === "block")
}

function is_showing(win: TagSuggestionWindowElm): boolean {
    return win.elm.style.display === "block"
}

function hide_window(win: TagSuggestionWindowElm) {
    win.elm.style.display = "none"
}

function show_window(win: TagSuggestionWindowElm) {
    win.elm.style.display = "block"
}

function clear_inners(win: TagSuggestionWindowElm){

}

function move_winow(win: TagSuggestionWindowElm, input_elm: Readonly<HTMLInputElement>) {
    let input_elm_bottom = input_elm.offsetTop + input_elm.offsetHeight
    win.elm.style.top = input_elm_bottom + "px"
    win.elm.style.left = input_elm.offsetLeft + "px"
}

function insert_data(win: TagSuggestionWindowElm, new_items: HTMLElement[]) {
    let inners = win.inners
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


//----------------------------------------------------------------------------------------------------//
//                                               EXPORT                                               //
//----------------------------------------------------------------------------------------------------//

export async function handle_input_tagbox(
    f: f_FetchSuggestion,
    win: TagSuggestionWindowElm,
    input_elm: Readonly<HTMLInputElement>
): Promise<Error | null> {
    let input_value = input_elm.value
    if (input_value === "") {
        if (is_showing(win)) {
            hide_window(win)
        }

        return null
    }

    let datas = await f(input_value)

    if (datas.err) {
        return Error("予期せぬエラー")
    }

    if (datas.data.length === 0) {
        if (is_showing(win)) {
            hide_window(win)
        }
        return null
    }


    if (!is_showing(win)) {
        show_window(win)
        move_winow(win, input_elm)
    }

    let new_items = datas.data.map(tag_data => create_suggestion_list_item(input_value, tag_data))
    insert_data(win, new_items)

    new_items[0].classList.add("suggestion-item-focus")
    win.focus_index = new CycleIndex(0)

    return null
}

export function move_focus_tag_suggestion_window(
    to: "up" | "down",
    win: TagSuggestionWindowElm
): Error | null {

    let inner = find_current_inner(win)
    if (inner === undefined) {
        return new Error("bug")
    }

    if (inner.childNodes.length === 0) {
        return null
    }

    let current_elm = inner.childNodes[win.focus_index.val]
    if (current_elm === undefined || !(current_elm instanceof HTMLElement)) {
        return new Error("bug")
    }

    let new_index
    if (to == "down") {
        new_index = win.focus_index.plus(inner.childNodes.length)
    } else {
        new_index = win.focus_index.minus(inner.childNodes.length)
    }

    let next_elm = inner.childNodes[new_index.val]

    if (next_elm === undefined || !(next_elm instanceof HTMLElement)) {
        return new Error("bug")
    }

    current_elm.classList.remove("suggestion-item-focus")
    next_elm.classList.add("suggestion-item-focus")

    scroll_to_focus_elm(
        next_elm,
        win.inner_padding
    )

    win.focus_index = new_index

    return null
}

export function done_suggestion(win: TagSuggestionWindowElm){
    if (!is_showing(win)){
        console.log("hello")
        return new Error("bug")
    } 

    let inner = find_current_inner(win)
    if (inner === undefined) {
        console.log("hello")
        return new Error("bug")
    }


    let focus_elm = inner.childNodes[win.focus_index.val]
    if (focus_elm === undefined || !(focus_elm instanceof HTMLElement)) {
        console.log("hello")
        return new Error("bug")
    }

    hide_window(win)
    clear_inners(win)

    return focus_elm.innerText
}

export class TagSuggestionWindowElm {
    elm: HTMLElement
    inners: HTMLElement[]
    inner_padding: HTMLElement
    focus_index: CycleIndex
    constructor() {

        this.focus_index = new CycleIndex(0)
        this.elm = document.createElement("div")
        this.elm.classList.add("tag-suggestion-window")
        this.elm.style.display = "none"

        this.inners = [
            document.createElement("div"),
            document.createElement("div"),
        ]

        this.inner_padding = document.createElement("div")
        this.inner_padding.classList.add("tag-suggestion-window-inner-padding")

        this.elm.appendChild(this.inner_padding)
        this.inners.forEach(elm => this.inner_padding.appendChild(elm))
    }
}