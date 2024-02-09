
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