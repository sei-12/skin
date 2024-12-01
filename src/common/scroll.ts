/**
 * 子要素と親要素のスクロール位置の関係性
 */
function child_elm_pos(container_elm: HTMLElement, child_elm: HTMLElement): ">" | "<=>" | "<" {

    if (child_elm.offsetTop < container_elm.scrollTop) {
        return ">"
    }

    if (child_elm.offsetTop + child_elm.offsetHeight > container_elm.scrollTop + container_elm.offsetHeight) {
        return "<"
    }

    return "<=>"
}

/**
 * 
 * @param focus_elm 
 * @param container_elm style.position = "absolute" | "relative" | "fixed"  である必要がある
 * @returns 
 */
export function scroll_to_focus_elm(focus_elm: HTMLElement, container_elm: HTMLElement) {

    // console.log("f.offsetTop", focus_elm.offsetTop)
    // console.log(child_elm_pos(container_elm, focus_elm))

    let pos = child_elm_pos(container_elm, focus_elm)
    if (pos === "<=>") {
        return
    }

    let top = null

    if (pos === "<") {
        top = focus_elm.offsetTop + focus_elm.offsetHeight - container_elm.clientHeight
    } else {
        top = focus_elm.offsetTop
    }

    if (top === null) {
        return
    }

    container_elm.scroll({
        top: top
    })
}