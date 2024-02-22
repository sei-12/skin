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
        top: top,
        behavior: "smooth"
    })
}

const NOTICE_TIME_MS = 8000
type NoticeType = "err"|"info"|"warn"

function create_new_notice_icon_elm(type: NoticeType){
    let elm = document.createElement("i")
    elm.classList.add("nf")
    elm.classList.add("notice-icon")
    
    if ( type === "err" ){
        elm.innerText = "\uea87" 
    }
    if ( type === "info" ){
        elm.innerText = "\uea74" 
    }
    if ( type === "warn" ){
        elm.innerText = "\uf071"
    }
    
    return elm
}

// function span(inner: HTMLElement){
//     let elm = document.createElement("span") 
//     elm.appendChild(inner)
//     return elm
// }

function create_new_notice_window(type: NoticeType, msg: string){
    let inner_txt = document.createElement("div")
    inner_txt.innerText = msg
    inner_txt.classList.add("notice-item-inner-txt")

    let elm = document.createElement("div")
    let type_css = "notice-item-" + type
    
    elm.classList.add("notice-item")
    elm.classList.add(type_css)
    
    elm.appendChild(create_new_notice_icon_elm(type))
    elm.appendChild(inner_txt)

    return elm
}

function _notice(parent_elm: HTMLElement,type: NoticeType, msg: string){
    let notice_elm = create_new_notice_window(type,msg)
    parent_elm.appendChild(notice_elm)
    scroll_to_focus_elm(notice_elm,parent_elm)
    
    setTimeout(() => {
        notice_elm.style.opacity = "0"
        notice_elm.style.pointerEvents = "none"
    },NOTICE_TIME_MS)
}

export namespace Notice {
    let elm: HTMLElement | null = null

    export function init(parent: HTMLElement){
        if ( elm !== null ){
            throw Error("bug")
        }
        
        elm = document.createElement("div")
        elm.classList.add("notice-container")
        
        let padding = document.createElement("div")
        padding.style.height = "100vh"

        elm.appendChild(padding)
        parent.appendChild(elm)
    }
    export function notice(type: NoticeType, msg: string) {
        if (elm === null) throw Error("bug")
        _notice(elm, type, msg)
    }
}