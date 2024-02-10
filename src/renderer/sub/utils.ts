
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