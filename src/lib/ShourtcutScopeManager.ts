
class Nest<T> {
    private nest: T[] = []

    constructor(rootValue: T) {
        this.nest.push(rootValue)
    }

    update(value: T) {
        if (value !== this.nest[this.nest.length - 1]) {
            this.nest.push(value)
        } else {
            this.nest.pop()
        }

        if (this.nest.length === 0) {
            throw new Error("")
        }
    }
    
    getLast(){
        return this.nest[this.nest.length - 1]
    }
}


const shourtcutScopeStatus = [
    "base",
    "tagSuggestionWindow",
    "createNewBookmark"
] as const;
export type ShourtcutScopeStatus = ( typeof shourtcutScopeStatus [number]);


export class ShourtcutScopeManager {

    private nest = new Nest<ShourtcutScopeStatus>("base")

    tagSuggestionWindow(value: "open" | "close") {
        if ( this.nest.getLast() === "tagSuggestionWindow" && value === "open" ){
            throw new Error("err in tagSuggestionWindow")
        }
        if ( this.nest.getLast() !== "tagSuggestionWindow" && value === "close" ){
            throw new Error("err in tagSuggestionWindow")
        }
        this.nest.update("tagSuggestionWindow")
    }

    createNewBkmk(value: "open" | "close") {
        if ( this.nest.getLast() === "createNewBookmark" && value === "open" ){
            throw new Error("bug")
        }
        if ( this.nest.getLast() !== "createNewBookmark" && value === "close" ){
            throw new Error("bug")
        }

        this.nest.update("createNewBookmark")
    }

    /**
     * こいつの戻り値をクラスにするか検討する
     */
    getCurrentStatus() {
        return this.nest.getLast()
    }
}
