
type NoticeType = "err"|"info"|"warn"

function create_new_notice_window(type: NoticeType, msg: string){
    let elm = document.createElement("div")
    let type_css = type + "-notice-window"
    
    elm.classList.add("notice-window")
    elm.classList.add(type_css)
    
    elm.innerText = msg
    
    return elm
}

function _notice(parent_elm: HTMLElement,type: NoticeType, msg: string){
    let notice_elm = create_new_notice_window(type,msg)
    // ポップアップで表示
    // N秒後に非表示
    // xボタンで非表示
    
    // いまだけ
    alert(type + ": "+ msg)
}

export namespace Notice {
    let elm: HTMLElement | null = null

    export function init(parent: HTMLElement){
        if ( elm !== null ){
            throw Error("bug")
        }

        elm = parent        
    }
    export function notice(type: NoticeType, msg: string) {
        if (elm === null) throw Error("bug")
        _notice(elm, type, msg)
    }
}