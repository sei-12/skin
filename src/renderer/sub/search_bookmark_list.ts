import { CycleIndex } from "./utils"

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

export class SearchedBookmarkList {
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

export const __local__ = {
    bkmk_data_from_bkmk_elm,
    create_new_bookmark_elm
}