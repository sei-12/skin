

export type PAGE_ELM_IDS = "pages:home" | "pages:add" | "pages:edit" | "pages:list"
export type WhenStr = "tag_suggestion"
type Handler = () => void

export class When {
    // ユーザーの設定から変換
    static from_string() {

    }

    page: PAGE_ELM_IDS | "anypage"
    private values: WhenStr[]

    constructor(vals: WhenStr[] | undefined = undefined, page: PAGE_ELM_IDS | "anypage" | undefined = undefined) {
        if (vals === undefined) {
            vals = []
        }

        if (page === undefined) {
            page = "anypage"
        }

        this.values = vals
        this.page = page
    }

    match(cur_page: PAGE_ELM_IDS, when_strs: WhenStr[]): boolean {
        if (this.page !== "anypage" && this.page !== cur_page) {
            return false
        }

        if (!this.values.every(v => when_strs.includes(v))) {
            return false
        }

        if (this.values.length !== when_strs.length) {
            return false
        }

        return true
    }
}

export class HotkeyMap {
    keydownHotkeyMap: {
        [key: string]: {
            when: When,
            handler: Handler
        }[]
    }

    constructor() {
        this.keydownHotkeyMap = {}
    }

    set_hotkey(key_str: string, when: When, handler: () => void) {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            this.keydownHotkeyMap[key_str] = []
        }

        this.keydownHotkeyMap[key_str].push({ when, handler })
    }

    get_hotkey(cur_page: PAGE_ELM_IDS, key_str: string, now: WhenStr[]): Handler | null {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            return null
        }

        let matched = this.keydownHotkeyMap[key_str].find(v => {
            return v.when.match(cur_page, now)
        })

        if (matched === undefined) {
            return null
        }

        return matched.handler
    }
}

//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                            STAND ALONE                                             //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//
export function create_new_tag_element(tagname: string, exists_db: boolean) {
    let elm = document.createElement("div")
    elm.innerText = tagname
    elm.classList.add("tag")
    if (exists_db) {
        elm.classList.add("tag-exists-db")
    } else {
        elm.classList.add("tag-not-exists-db")
    }
    return elm
}

