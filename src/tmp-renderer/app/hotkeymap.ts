type Handler = () => void

export class HotkeyMap {
    keydownHotkeyMap: {[key: string]: Handler}

    constructor() {
        this.keydownHotkeyMap = {}
    }

    set_hotkey(hash_key: string, handler: () => void) {
        if (this.keydownHotkeyMap[hash_key] === undefined) {
            this.keydownHotkeyMap[hash_key] = handler
        }
    }

    get_hotkey(hash_key: string): Handler | null {
        if (this.keydownHotkeyMap[hash_key] === undefined) {
            return null
        }

        return this.keydownHotkeyMap[hash_key]
    }
}