import { HitTagListElm } from "../app/hit_tag_list"
import { InputTagElm } from "../app/input_tag"
import { SearchedBookmarkListElm } from "../app/searched_bookmarks"
import { TagSuggestionWindowElm } from "../app/tag_suggestion"



class HomeElm {
    elm: HTMLElement
    tag_sugestion_window: TagSuggestionWindowElm
    input_tag: InputTagElm

    hit_tag_list: HitTagListElm

    searched_bkmks: SearchedBookmarkListElm

    constructor() {
        this.elm = document.createElement("div")
        this.elm.style.display = "block"


        this.input_tag = new InputTagElm()
        this.hit_tag_list = new HitTagListElm()
        this.tag_sugestion_window = new TagSuggestionWindowElm()
        this.searched_bkmks = new SearchedBookmarkListElm()

        let inner_flex = document.createElement("div")
        inner_flex.classList.add("home-inner-flex")

        let layout_left = document.createElement("div")
        layout_left.classList.add("home-inner-layout-left")
        layout_left.appendChild(this.input_tag.elm)
        layout_left.appendChild(this.searched_bkmks.elm)

        inner_flex.appendChild(layout_left)
        inner_flex.appendChild(this.hit_tag_list.elm)

        this.elm.appendChild(this.tag_sugestion_window.elm)
        this.elm.appendChild(inner_flex)
    }
}

export class RootElement {
    elm: HTMLBodyElement

    home: HomeElm

    constructor(elm: HTMLBodyElement) {
        this.elm = elm
        this.home = new HomeElm()

        this.elm.appendChild(this.home.elm)
    }
}