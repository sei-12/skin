
function create_elm(data: { name: string, count: number }) {

    let name_elm = document.createElement("div")
    name_elm.innerText = data.name
    name_elm.classList.add("hit-tag-list-item-name")

    let count_elm = document.createElement("div")
    count_elm.innerText = "" + data.count
    count_elm.classList.add("hit-tag-list-item-count")

    let elm = document.createElement("div")
    elm.classList.add("hit-tag-list-item")
    elm.appendChild(name_elm)
    elm.appendChild(count_elm)

    return elm
}

export class HitTagListElm {
    elm: HTMLElement
    constructor() {
        this.elm = document.createElement("div")
    }
}

export async function reload_hittaglist_elm(tags: string[], f: f_FetchHitTags, elm: HitTagListElm) {
    let responce = await f(tags)
    if (responce.err !== null) {
        return responce.err
    }

    elm.elm.innerHTML = ""

    responce.data.forEach(data => {
        elm.elm.appendChild(
            create_elm(data)
        )
    })
}
