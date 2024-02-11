
function span(inner: string){
    let elm = document.createElement("span")
    elm.innerText = inner
    return elm
}

function craete_tag_list_item(tagdata: TagData,handle_done_edit: (tagdata:TagData) => unknown ): HTMLElement {
    let inner_elm = document.createElement("div")
    inner_elm.innerText = `id: ${tagdata.id} name: ${tagdata.name} oto: ${tagdata.oto}`

    let edit_start_button = document.createElement("input")
    edit_start_button.type = "button"
    edit_start_button.value = "edit"

    // ホットキーでの編集の開始はしない
    // 技術的に俺ができないから
    edit_start_button.addEventListener("click", () => {
        if ( editor_container.style.display === "none" ){ 
            editor_container.style.display = "block" 
        }else{
            editor_container.style.display = "none"
        }
    })

    let editor_container = document.createElement("div")
    editor_container.style.display = "none"
    {
        let input_name = document.createElement("input")
        input_name.value = tagdata.name

        let input_oto = document.createElement("input")
        input_oto.value = tagdata.oto

        let edit_done = document.createElement("input")
        edit_done.value = "done"
        edit_done.type = "button"
        edit_done.addEventListener("click",() => handle_done_edit({
            name: input_name.value,
            oto: input_oto.value,
            id: tagdata.id
        }) )

        editor_container.appendChild(span("name"))
        editor_container.appendChild(input_name)
        editor_container.appendChild(span("oto"))
        editor_container.appendChild(input_oto)
        editor_container.appendChild(edit_done)
    }

    let elm = document.createElement("div")
    elm.appendChild(inner_elm)
    elm.appendChild(edit_start_button)
    elm.appendChild(editor_container)

    return elm
}


export async function reload_taglist_elm(tag_list_elm: HTMLElement ,handle_done_edit: (tagdata:TagData) => unknown) {
    let tags = await window.app.fetch_tag_list()

    if (tags.err !== null) {
        console.error(tags.err.message)
        return
    }

    let list_items = tags.data.map(tagdata => craete_tag_list_item(tagdata,handle_done_edit))
    tag_list_elm.innerHTML = ""
    list_items.forEach(elm => tag_list_elm.appendChild(elm))
}

export const __local__ = {
    craete_tag_list_item
}