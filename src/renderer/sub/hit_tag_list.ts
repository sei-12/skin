

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

export async function reload_hit_tag_list(tags: string[], elm: HTMLElement) {
    let hit_tags = await window.app.fetch_hit_tags(tags)
    if (hit_tags.err !== null) {
        return hit_tags.err
    }

    elm.innerHTML = ""

    hit_tags.data.forEach(data => {
        let child = create_elm(data)
        elm.appendChild(child)
    })
}

