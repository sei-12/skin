

function craete_tag_list_item(tagdata: TagData): HTMLElement {
    let inner_data_elm = document.createElement("div")
    inner_data_elm.innerText = JSON.stringify(tagdata)
    inner_data_elm.style.display = "none"

    let inner_elm = document.createElement("div")
    inner_elm.innerText = `id: ${tagdata.id} name: ${tagdata.name} oto: ${tagdata.oto}`

    let elm = document.createElement("div")
    elm.appendChild(inner_data_elm)
    elm.appendChild(inner_elm)

    return elm
}

export async function reload_taglist_elm(tag_list_elm: HTMLElement) {
    let tags = await window.app.fetch_tag_list()

    if (tags.err !== null) {
        console.error(tags.err.message)
        return
    }

    let list_items = tags.data.map(tagdata => craete_tag_list_item(tagdata))
    tag_list_elm.innerHTML = ""
    list_items.forEach(elm => tag_list_elm.appendChild(elm))
}

export const __local__ = {
    craete_tag_list_item
}