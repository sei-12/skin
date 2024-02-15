import { TagSuggestionWindowElm } from "../app/tag_suggestion"

class InputTagElm {
    elm: HTMLElement
    input_box: HTMLInputElement
    inputed_tags: HTMLDivElement

    constructor(){
        this.elm = document.createElement("div")
        this.input_box = document.createElement("input")
        this.inputed_tags = document.createElement("div")

        this.elm.appendChild(this.inputed_tags)
        this.elm.appendChild(this.input_box)
    }
}

class HomeElm {
    elm: HTMLElement
    tag_sugestion_window: TagSuggestionWindowElm
    input_tag: InputTagElm

    hit_tag_list: HTMLElement

    searched_bkmks: HTMLElement

    constructor() {
        this.elm = document.createElement("div")
        this.elm.style.display = "block"
        this.input_tag = new InputTagElm()
        this.hit_tag_list = document.createElement("div")
        this.tag_sugestion_window = new TagSuggestionWindowElm()
        this.searched_bkmks = document.createElement("div")

        let inner_flex = document.createElement("div")
        inner_flex.appendChild(this.input_tag.elm)
        inner_flex.appendChild(this.searched_bkmks)
        inner_flex.appendChild(this.hit_tag_list)
    
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