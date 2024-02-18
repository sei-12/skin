
export class CycleIndex {
    val: number

    constructor(val: number) {
        this.val = val
    }

    plus(len: number) {
        let next = this.val + 1
        if (next >= len) {
            next = 0
        }
        return new CycleIndex(next)
    }

    minus(len: number) {
        let next = this.val - 1
        if (next < 0) {
            next = len - 1
        }
        return new CycleIndex(next)
    }
}


// Utils候補
export class MutationDisplayObserver {
    private mo: MutationObserver
    private current_display: string | null

    constructor(callback: (mutations_list: MutationRecord[], old_display: string, current_display: string) => void) {
        this.current_display = null
        this.mo = new MutationObserver((mutations_list) => {
            for (const mutation of mutations_list) {
                if (mutation.type !== 'attributes' || mutation.attributeName !== 'style') {
                    continue
                }

                if (!(mutation.target instanceof HTMLElement)) {
                    continue
                }

                if (this.current_display === null) {
                    console.error("bug MutationDisplayObserver")
                    continue
                }

                if (this.current_display === mutation.target.style.display) {
                    continue
                }

                callback(mutations_list, this.current_display, mutation.target.style.display)
            }
        })
    }

    observe(target: HTMLElement) {
        this.current_display = target.style.display
        this.mo.observe(target, { attributes: true })
    }
}


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

    console.log("f.offsetTop", focus_elm.offsetTop)
    console.log(child_elm_pos(container_elm, focus_elm))

    let pos = child_elm_pos(container_elm, focus_elm)
    if (pos === "<=>") {
        return
    }

    let top = null
    let p = focus_elm.offsetParent!

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