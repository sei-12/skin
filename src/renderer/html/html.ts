import { BookmarkForm } from "../app/bkmk_form"
import { EditBookmarkPageElm } from "../app/edit_bookmark"
import { GotoAddPageButton } from "../app/goto_add_page_btn"
import { GotuPrevPageButton } from "../app/goto_prev_button"
import { HitTagListElm } from "../app/hit_tag_list"
import { InputTagElm } from "../app/input_tag"
import { SearchedBookmarkListElm } from "../app/searched_bookmarks"
import { TagSuggestionWindowElm } from "../app/tag_suggestion"



class HomePageElm {
    elm: HTMLElement
    tag_suggestion_window: TagSuggestionWindowElm
    input_tag: InputTagElm

    hit_tag_list: HitTagListElm

    searched_bkmks: SearchedBookmarkListElm
    goto_add_page: GotoAddPageButton

    constructor() {
        this.elm = document.createElement("div")
        this.elm.style.display = "block"

        this.goto_add_page = new GotoAddPageButton()

        this.input_tag = new InputTagElm()
        this.hit_tag_list = new HitTagListElm()
        this.tag_suggestion_window = new TagSuggestionWindowElm()
        this.searched_bkmks = new SearchedBookmarkListElm()

        let inner_flex = document.createElement("div")
        inner_flex.classList.add("home-inner-flex")

        let layout_left = document.createElement("div")
        layout_left.classList.add("home-inner-layout-left")
        layout_left.appendChild(this.input_tag.elm)
        layout_left.appendChild(this.searched_bkmks.elm)

        let layout_right = document.createElement("div")
        layout_right.classList.add("home-inner-layout-right")
        layout_right.appendChild(this.goto_add_page.elm)
        layout_right.appendChild(this.hit_tag_list.elm)

        inner_flex.appendChild(layout_left)
        inner_flex.appendChild(layout_right)

        this.elm.appendChild(this.tag_suggestion_window.elm)
        this.elm.appendChild(inner_flex)
    }
}


class AddPageElm {
    elm: HTMLElement
    form: BookmarkForm
    go_home: GotuPrevPageButton

    constructor() {
        this.elm = document.createElement("div")
        this.elm.style.display = "none"

        this.go_home = new GotuPrevPageButton()

        this.form = new BookmarkForm()

        let go_prev_pos = document.createElement("div")
        go_prev_pos.classList.add("add-page-go-prev-button-pos")
        go_prev_pos.appendChild(this.go_home.elm)

        this.elm.appendChild(this.form.elm)
        this.elm.appendChild(go_prev_pos)
    }

}

export class RootElement {
    elm: HTMLBodyElement

    home: HomePageElm
    add: AddPageElm
    edit_bkmk: EditBookmarkPageElm

    constructor(elm: HTMLBodyElement) {
        this.elm = elm
        this.home = new HomePageElm()
        this.add = new AddPageElm()
        this.edit_bkmk = new EditBookmarkPageElm()

        this.elm.appendChild(this.home.elm)
        this.elm.appendChild(this.add.elm)
        this.elm.appendChild(this.edit_bkmk.elm)
    }
}