import { CycleIndex } from "./utils"

function create_suggestion_list_item(find_word: string, tag_data: TagData): HTMLDivElement | null {
    let div = document.createElement("div")
    let re = new RegExp(find_word, "i")
    let match_str = tag_data.name.match(re)
    if (match_str === null) {
        return null
    }
    let html = `<span class="suggestion-item-match-str">${match_str}</span>`
    let name = tag_data.name.replace(re, html)
    div.innerHTML = name
    div.classList.add("suggestion-item")
    return div
}

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


export class TagSuggestionWindow {
    inners: HTMLDivElement[]
    elm: HTMLDivElement
    showing_now: boolean
    suggestion_items: HTMLDivElement[]
    focus_index: CycleIndex
    target_elm: HTMLInputElement | null

    constructor(elm: HTMLDivElement, inners: HTMLDivElement[]) {
        this.inners = inners
        this.elm = elm
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

        let elms = datas.data.map(d => create_suggestion_list_item(find_word, d))
        let tmp: HTMLDivElement[] = []
        elms.forEach(elm => {
            if (elm !== null) {
                tmp.push(elm)
            }
        })

        this.suggestion_items = tmp

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

export const __local__ = {
    create_suggestion_list_item
}