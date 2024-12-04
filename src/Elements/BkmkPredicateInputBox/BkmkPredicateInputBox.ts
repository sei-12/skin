import { h } from "../../common/dom"
import styles from "./style.module.css"
import { I_CommandEmmiter } from "../../lib/CommandEmmiter"
import { CommandEmiterListener } from "../../lib/EmiterCore"
import { TagElement } from "../TagElement/Tag"
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow"

export class BkmkPredicate {
    constructor(
        private inputedTags: Set<string>
    ){
        
    }
    tags(): Set<string> {
        return this.inputedTags
    }
}

class TagFinderFiltDuplicate implements TagSuggestionWindow.TagFinder {
    private inputed = new Set<string>()
    constructor( private core: TagSuggestionWindow.TagFinder){ }

    async find(predicate: string): Promise<string[]> {
        let result = await  this.core.find(predicate)
        return result.filter( tag => !this.inputed.has(tag) )
    }

    addInputedTag(tag: string){
        this.inputed.add(tag)
    }
    removeInputedTag(tag: string){
        this.inputed.delete(tag)
    }
}

export class BkmkPredicateInputBox {

    private elm = h(`div.${styles.root}`, [
        h(`div.${styles.tagbox}@tagbox`),
        h(`input.${styles.inputbox}@inputbox`),
    ])
    private listener: CommandEmiterListener
    private tagSuggestionWindow: TagSuggestionWindow.Element

    
    private tagFinderFiltDuplicate: TagFinderFiltDuplicate
    private inputedTagSet = new Set<string>()
    private inputedTagAry: TagElement[] = []

    private addExistsTag(tag: string) {
        let tagElm = new TagElement(tag, true)

        if (this.inputedTagSet.has(tag)) {
            throw new Error("duplicate tag")
        }

        this.inputedTagSet.add(tag)
        this.inputedTagAry.push(tagElm)
        this.tagFinderFiltDuplicate.addInputedTag(tag)
    
        this.elm.tagbox.appendChild(tagElm.root)
        
        if ( this.handleOnChange ){ this.handleOnChange() }
    }

    private popTag() {
        let lastElm = this.inputedTagAry.pop()
        if ( lastElm === undefined ){
            return
        }
        this.inputedTagSet.delete(lastElm.text)
        this.tagFinderFiltDuplicate.removeInputedTag(lastElm.text)
        this.elm.tagbox.removeChild(lastElm.root)

        if ( this.handleOnChange ){ this.handleOnChange() }
    }


    private calcPos() {
        let top = this.elm.inputbox.offsetTop + this.elm.inputbox.clientHeight
        let left = this.elm.inputbox.offsetLeft

        return {
            top,
            left
        }
    }

    constructor(
        tagFinder: TagSuggestionWindow.TagFinder,
        commandEmiter: I_CommandEmmiter,
    ) {
        this.tagFinderFiltDuplicate = new TagFinderFiltDuplicate(tagFinder)

        this.tagSuggestionWindow = new TagSuggestionWindow.Element(
            this.tagFinderFiltDuplicate,
            commandEmiter
        )

        this.elm.inputbox.placeholder = "/"
        this.listener = new CommandEmiterListener(
            [
                "focusBkmkPredicateInputbox", () => {
                    this.elm.inputbox.focus()
                }
            ]
        )

        commandEmiter.addWeakRefListener(this.listener)

        this.elm.inputbox.addEventListener("input", () => {
            this.tagSuggestionWindow.update(this.elm.inputbox.value)
            let pos = this.calcPos()
            this.tagSuggestionWindow.setWindowPos(pos.top, pos.left)
        })
        this.elm.inputbox.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                let tag = this.tagSuggestionWindow.getFocused()
                // console.log(tag)
                if (tag === null) { return }
                this.addExistsTag(tag)

                this.elm.inputbox.value = ""
                this.tagSuggestionWindow.update("")
            }

            if (e.key === "Backspace" && this.elm.inputbox.value === "") {
                this.popTag()
            }
        })

        this.elm.root.appendChild(this.tagSuggestionWindow.root)

    }

    private handleOnChange: (() => void) | null = null

    getPredicate(): BkmkPredicate {
        return new BkmkPredicate(
            new Set(this.inputedTagSet) // 参照を渡してはいけない
        )
    }

    setHandleOnChange(handler: () => void) {
        if (this.handleOnChange !== null) {
            throw new Error("想定してない")
        }

        this.handleOnChange = handler
    }

    root: HTMLElement = this.elm.root
}