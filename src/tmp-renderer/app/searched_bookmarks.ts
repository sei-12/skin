
function create_bkmk_list_item_elm(data: BookmarkData) {
    let data_elm = document.createElement("div")
    data_elm.innerText = JSON.stringify(data)
    data_elm.classList.add("data")
    data_elm.style.display = "none"

    let title_elm = document.createElement("div")
    title_elm.innerText = data.title
    title_elm.classList.add("bookmark-list-item-title")

    let description_elm = document.createElement("div")
    description_elm.innerText = data.description
    description_elm.classList.add("bookmark-list-item-desc")

    let craeted_at_elm = document.createElement("div")
    let replace_re = new RegExp("-", "g")
    craeted_at_elm.innerText = "created at: " + data.created_at.replace(replace_re, "/")
    craeted_at_elm.classList.add("bookmark-list-item-created-at")

    let div = document.createElement("div")
    div.classList.add("bookmark-list-item-container")
    div.appendChild(title_elm)
    div.appendChild(craeted_at_elm)
    div.appendChild(description_elm)
    // TODO
    div.appendChild(data_elm)
    return div
}

export class SearchedBookmarkListElm {
    elm: HTMLElement
    constructor() {
        this.elm = document.createElement("div")
    }
}

export function insert_searched_bookmarks(bkmks: BookmarkData[], into: SearchedBookmarkListElm) {
    let elms = bkmks.map( data => create_bkmk_list_item_elm(data) )
    into.elm.innerHTML = ""
    elms.forEach( elm => {
        into.elm.appendChild(elm)
    })
}
