import { BookmarkForm, check_inputed_data, clear_form, parse_inputed_data, set_bookmark_data_into_form } from "./bkmk_form"
import { GotuPrevPageButton } from "../sub/goto_prev_button"
import { clear_input_tag_elm, set_tags_into_input_tag } from "../sub/input_tag"

export class EditBookmarkPageElm {
    target_data: BookmarkData | null
    elm: HTMLElement
    form: BookmarkForm
    go_home: GotuPrevPageButton

    constructor() {
        this.target_data = null

        this.elm = document.createElement("div")
        this.elm.style.display = "none"

        this.form = new BookmarkForm()
        this.go_home = new GotuPrevPageButton()

        let go_prev_pos = document.createElement("div")
        go_prev_pos.classList.add("add-page-go-prev-button-pos")
        go_prev_pos.appendChild(this.go_home.elm)

        this.elm.appendChild(this.form.elm)
        this.elm.appendChild(go_prev_pos)
    }
}

export function set_bookmark_data_into_edit_page(
    elm: EditBookmarkPageElm,
    data: BookmarkData,
    tags: string[]
) {

    set_bookmark_data_into_form(
        data, elm.form
    )
    set_tags_into_input_tag(tags, elm.form.input_tag)
    elm.target_data = data
}

export function parse_edit_page_form(
    elm: EditBookmarkPageElm
): {
    data: BookmarkData,
    tags: string[]
} | string[] | Error{
    let bkmkdata = parse_inputed_data(elm.form)
    let errors = check_inputed_data(bkmkdata)
    if (errors.length !== 0) {
        return errors
    }

    if (elm.target_data === null) {
        return new Error("bug")
    }
    let id = elm.target_data.id


    let data: BookmarkData = {
        id: elm.target_data.id,
        created_at: elm.target_data.created_at,
        title: bkmkdata.title,
        url: bkmkdata.url,
        description: bkmkdata.description
    }

    return {
        data,
        tags: bkmkdata.tags
    }
}

export function clear_edit_page(
    elm: EditBookmarkPageElm
) {
    clear_form(elm.form)
}