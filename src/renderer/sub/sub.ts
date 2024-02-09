

export type PAGE_ELM_IDS = "pages:home" | "pages:add" | "pages:edit" | "pages:list"
export type WhenStr = "tag_suggestion"

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
