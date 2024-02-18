
export class GotuPrevPageButton {
    elm: HTMLButtonElement

    constructor() {
        this.elm = document.createElement("button")
        this.elm.classList.add("go-prev-page-button")

        let italic = document.createElement("i")
        italic.classList.add("nf")
        italic.innerText = "\uea9b"

        this.elm.appendChild(italic)
    }
}