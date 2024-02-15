import { CycleIndex } from "../utils"

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
export class TagSuggestionWindowElm {
    elm: HTMLElement
    inners: HTMLElement[]
    constructor() {

        this.elm = document.createElement("div")
        this.elm.classList.add("tag-suggestion-window")
        this.elm.style.display = "none"

        this.inners = [
            document.createElement("div"),
            document.createElement("div"),
        ]

        let inner_pad = document.createElement("div")
        inner_pad.classList.add("tag-suggestion-window-inner-padding")

        this.elm.appendChild(inner_pad)
        this.inners.forEach(elm => inner_pad.appendChild(elm))
    }
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

    return null
}

