import { RootElement } from "../html/html"

type PageName = "home" | "add" | "edit_bkmk"

export function get_current_page_name(
    root: RootElement
): PageName | Error{
    if (root.home.elm.style.display === "block") {
        return "home"
    }
    if ( root.add.elm.style.display === "block"){
        return "add"
    }
    if ( root.edit_bkmk.elm.style.display === "block") {
        return "edit_bkmk"
    }

    return new Error("bug")
}

export function switch_page(root: RootElement,to: PageName){
    let cur = get_current_page_name(root)
    if ( cur instanceof Error ){
        return cur
    }

    root[to].elm.style.display = "block"
    root[cur].elm.style.display = "none"
}
