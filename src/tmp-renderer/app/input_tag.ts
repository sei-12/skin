
function create_inputed_tag_elm(tag: string) {
    let elm = document.createElement("div")
    elm.innerText = tag
    return elm
}

export class InputTagElm {
    elm: HTMLElement
    input_box: HTMLInputElement
    inputed_tags: HTMLDivElement

    constructor() {
        this.elm = document.createElement("div")
        this.elm.classList.add("input-tag-container")
        this.input_box = document.createElement("input")
        this.input_box.classList.add("input-tag-box")
        this.inputed_tags = document.createElement("div")
        this.inputed_tags.classList.add("inputed-tags")

        this.elm.appendChild(this.inputed_tags)
        this.elm.appendChild(this.input_box)
    }
}

export function clear_input_box(input_tag: InputTagElm) {
    input_tag.input_box.value = ""
}


export function insert_tag(input_tag: InputTagElm, tag: string) {
    input_tag.inputed_tags.appendChild(
        create_inputed_tag_elm(tag)
    )
}

export function handle_backspace_on_input_tag_box(input_tag: InputTagElm) {
    if (input_tag.input_box.value !== ""){
        return
    }

    let last = input_tag.inputed_tags.lastElementChild 
    if ( last ===  null ){
        return
    }

    input_tag.inputed_tags.removeChild(last)

}

export function insert_tag_not_complement(input_tag: InputTagElm){
    let val = input_tag.input_box.value
    clear_input_box(input_tag)
    insert_tag(input_tag,val)
}

export function get_inputed_tags(input_tag: InputTagElm){
    let child_nodes = input_tag.inputed_tags.childNodes 
    let tags: string[] = []

    child_nodes.forEach( node => {
        if ( node instanceof HTMLElement ){
            tags.push(node.innerText)
        }
    })

    return tags
}