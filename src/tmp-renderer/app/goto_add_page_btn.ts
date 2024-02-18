
export class GotoAddPageButton {
    elm: HTMLButtonElement
    constructor() {
        this.elm = document.createElement("button")
        this.elm.classList.add("goto-addpage-button")

        let italic = document.createElement("i")
        italic.classList.add("nf")
        italic.innerText = "\uea60"



        this.elm.appendChild(italic)
    }
}
