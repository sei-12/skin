import { InputTagElm, clear_input_tag_elm, get_inputed_tags } from "./input_tag"
import { TagSuggestionWindowElm } from "./tag_suggestion"

export class BookmarkForm {
    elm: HTMLElement

    url_box: HTMLInputElement
    title_box: HTMLInputElement
    input_tag: InputTagElm
    tag_suggestion_window: TagSuggestionWindowElm
    done_button: HTMLButtonElement
    description: HTMLTextAreaElement

    constructor() {
        this.elm = document.createElement("div")
        this.elm.classList.add("bookmark-form-container")

        let h3 = document.createElement("h3")
        h3.innerText = "Create New Bookmark"

        this.tag_suggestion_window = new TagSuggestionWindowElm()
        this.input_tag = new InputTagElm()

        this.done_button = document.createElement("button")
        this.done_button.innerText = "done"
        this.done_button.classList.add("bookmark-form-done-button")

        this.url_box = document.createElement("input")
        this.url_box.classList.add("bookmark-form-input-box")
        this.url_box.placeholder = "url"

        this.title_box = document.createElement("input")
        this.title_box.classList.add("bookmark-form-input-box")
        this.title_box.placeholder = "title"

        this.description = document.createElement("textarea")
        this.description.placeholder = "description"
        this.description.rows = 4
        this.description.classList.add("bookmark-form-text-area")

        this.elm.appendChild(h3)
        this.elm.appendChild(this.url_box)
        this.elm.appendChild(this.tag_suggestion_window.elm)
        this.elm.appendChild(this.title_box)
        this.elm.appendChild(this.input_tag.elm)
        this.elm.appendChild(this.description)
        this.elm.appendChild(this.done_button)
    }
}

type InputedBookmarkData = {
    url: string,
    title: string,
    tags: string[],
    description: string
}

export function check_inputed_data(data: InputedBookmarkData): string[] {
    let errors:string[] = []
    if ( data.title === "" ){
        errors.push("タイトルが入力されていません")
    }

    if ( data.url === "" ){
        errors.push("URLが入力されていません")
    }

    if (data.tags.length === 0){
        errors.push("タグが入力されていません。最低一つ以上入力する必要があります")
    }

    return errors
}

export function parse_inputed_data(form: BookmarkForm): InputedBookmarkData {
    let url = form.url_box.value
    let title = form.title_box.value
    let tags = get_inputed_tags(form.input_tag)
    let description = form.description.value

    return {
        url,
        title,
        tags,
        description
    }
}

export function clear_form(form: BookmarkForm){
    form.url_box.value = ""
    form.title_box.value = ""
    form.description.value = ""
    clear_input_tag_elm(form.input_tag)
}