
export class TagSuggestionWindowElm {
    elm: HTMLElement
    inners: HTMLElement[]
    constructor(){
        
        this.elm = document.createElement("div")
        this.elm.classList.add("tag-suggesion-window")

        this.inners = [
            document.createElement("div"),
            document.createElement("div"),
        ]

        let inner_pad = document.createElement("div")
        inner_pad.classList.add("tag-suggestion-window-inner-padding")

        this.elm.appendChild(inner_pad)
        this.inners.forEach( elm => inner_pad.appendChild(elm) )
    }
}