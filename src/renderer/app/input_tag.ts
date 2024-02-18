
function create_inputed_tag_elm(tag: string,exists_db: boolean) {
    let elm = document.createElement("div")
    elm.innerText = tag
    elm.classList.add("tag")
    if (exists_db) {
        elm.classList.add("tag-exists-db")
    } else {
        elm.classList.add("tag-not-exists-db")
    }
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
        this.input_box.spellcheck = false
        this.input_box.placeholder = "tag"
        this.inputed_tags = document.createElement("div")
        this.inputed_tags.classList.add("inputed-tags")

        this.elm.appendChild(this.inputed_tags)
        this.elm.appendChild(this.input_box)
    }
}

export function clear_input_tag_elm(input_tag: InputTagElm){
    clear_input_box(input_tag)
    input_tag.inputed_tags.innerHTML = ""
}

export function clear_input_box(input_tag: InputTagElm) {
    input_tag.input_box.value = ""
}


export function insert_tag(input_tag: InputTagElm, tag: string, exists_db: boolean) {
    input_tag.inputed_tags.appendChild(
        create_inputed_tag_elm(tag,exists_db)
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

export async function insert_tag_not_complement(input_tag: InputTagElm, f: f_TagExistsDB){
    let val = input_tag.input_box.value
    clear_input_box(input_tag)
    let exists_db = await f(val)
    insert_tag(input_tag,val,exists_db)
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