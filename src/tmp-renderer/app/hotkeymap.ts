type Handler = () => void

export class HotkeyMap {
    keydownHotkeyMap: {
        [key: string]: {
            // when: When,
            handler: Handler
        }[]
    }

    constructor() {
        this.keydownHotkeyMap = {}
    }

    set_hotkey(key_str: string, handler: () => void) {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            this.keydownHotkeyMap[key_str] = []
        }

        this.keydownHotkeyMap[key_str].push({ handler })
    }

    get_hotkey( key_str: string ): Handler | null {
        if (this.keydownHotkeyMap[key_str] === undefined) {
            return null
        }

        return this.keydownHotkeyMap[key_str][0].handler
        // let matched = this.keydownHotkeyMap[key_str].find(v => {
        //     // return v.when.match(cur_page, now)
        //     return 
        // })

        // if (matched === undefined) {
        //     return null
        // }

        // return matched.handler
    }
}