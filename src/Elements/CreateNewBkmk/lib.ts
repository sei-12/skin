import { Assert } from "../../common/Assert";
import { h } from "../../common/dom";
import { I_CommandEmmiter } from "../../lib/CommandEmmiter";
import { CommandEmiterListener } from "../../lib/EmiterCore";
import { TagElement } from "../TagElement/Tag";
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow";
import style from "./style.module.css"

export interface BkmkCreater {
    create(
        title: string,
        url: string,
        desc: string,
        tags: Set<string>,
    ): Promise<boolean>
}

class TagFinderFiltDuplicate implements TagSuggestionWindow.TagFinder {
    private inputed = new Set<string>()
    constructor( private core: TagSuggestionWindow.TagFinder){ }

    async find(predicate: string): Promise<string[]> {
        let result = await  this.core.find(predicate)
        let filted = result.filter( tag => !this.inputed.has(tag) )
        return filted
    }

    addInputedTag(tag: string){
        this.inputed.add(tag)
    }
    removeInputedTag(tag: string){
        this.inputed.delete(tag)
    }
}

class InputTags {
    private static generateElm(){
        return h(`div.${style.inputTagsRoot}`,[
            h(`div.${style.inputTagsTagBox}@tagbox`),
            h(`input.${style.inputTagsInputBox}@inputbox`),
        ])
    }

    private tagSuggestionWindow: TagSuggestionWindow.Element
    private elm = InputTags.generateElm()
    public root = this.elm.root

    private tagFinderFiltDuplicate: TagFinderFiltDuplicate
    private inputedTagSet = new Set<string>()
    private inputedTagAry: TagElement[] = []

    private addExistsTag(tag: string) {
        let tagElm = new TagElement(tag, true)

        if (this.inputedTagSet.has(tag)) {
            throw new Error(`duplicate tag: \"${tag}\".`)
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

    private handleOnChange: (() => void) | null = null

    setHandleOnChange(handler: () => void) {
        if (this.handleOnChange !== null) {
            throw new Error("想定してない")
        }

        this.handleOnChange = handler
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
        emiter: I_CommandEmmiter
    ){
        this.tagFinderFiltDuplicate = new TagFinderFiltDuplicate(tagFinder)

        this.tagSuggestionWindow = new TagSuggestionWindow.Element(
            this.tagFinderFiltDuplicate,
            emiter
        )

        this.elm.inputbox.addEventListener("input", () => {
            this.tagSuggestionWindow.update(this.elm.inputbox.value)
            let pos = this.calcPos()
            this.tagSuggestionWindow.setWindowPos(pos.top, pos.left)
        })
        this.elm.inputbox.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                let tag = this.tagSuggestionWindow.getFocused()
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
    
    valiCheck(): boolean{
        if ( this.inputedTagAry.length === 0){
            return false
        }else{
            return true
        }
    }

    getTags():Set<string>{
        // チェック済み前提
        Assert.isTrue(this.valiCheck())
        return new Set(this.inputedTagSet)
    }
}

export class CreateNewBkmkForm {
    private static generate(){
        const root = h(`div.${style.root}`,[
            h(`div.${style.inner}`,[
                h(`input.${style.titleInputBox}@titleInputBox`),
                h(`input.${style.urlInputBox}@urlInputBox`),
                h(`div.${style.tagsInputBox}@tagsInputBox`),
                h(`textarea.${style.descInputBox}@descInputBox`),
                h(`button.${style.doneButton}@doneButton`),
                h(`button.${style.cancelButton}@cancelButton`),
            ])
        ])
        
        root.cancelButton.innerText = "Cancel"
        root.doneButton.innerText = "Done"
        root.descInputBox.placeholder = "description"
        root.descInputBox.rows = 3
        root.titleInputBox.placeholder = "title"
        root.urlInputBox.placeholder = "url"
        return root
    }

    private listener = new CommandEmiterListener(
        ["createNewBkmk.start", () => { this.open() }],
        ["createNewBkmk.done", () => { this.done() }],
        ["createNewBkmk.cancel", () => { this.close() }],
    )

    private opened = false
    private elm = CreateNewBkmkForm.generate()
    private canDone = false
    private inputTags: InputTags
    public root = this.elm.root
    
    private valiCheck(){
        if ( this.elm.titleInputBox.value === "" ){
            return false
        }
        if ( this.elm.urlInputBox.value === "" ){
            return false
        }
        if ( this.inputTags.valiCheck() === false ){
            return false
        }

        return true
    }
    constructor(
        emiter: I_CommandEmmiter,
        tagFinder: TagSuggestionWindow.TagFinder,
        private creatar: BkmkCreater
    ){
        emiter.addWeakRefListener(this.listener)
        this.inputTags = new InputTags(
            tagFinder,
            emiter
        )
        this.elm.tagsInputBox.appendChild(this.inputTags.root)
        this.close()
        
        this.elm.doneButton.addEventListener("click",() => {
            this.done()
        })
        this.elm.cancelButton.addEventListener("click",() => {
            this.close()
        })

        this.elm.urlInputBox.addEventListener("input",() => { this.canDone = this.valiCheck() })
        this.elm.titleInputBox.addEventListener("input",() => { this.canDone = this.valiCheck() })
        this.inputTags.setHandleOnChange(() => { this.canDone = this.valiCheck() })
    }

    private async done(){
        if ( !this.opened ){
            return
        }

        if ( !this.canDone ){
            return
        }

        await this.creatar.create(
            this.elm.titleInputBox.value,
            this.elm.urlInputBox.value,
            this.elm.descInputBox.value,
            this.inputTags.getTags()
        )

        this.close()
    }
    
    private open(){
        this.opened = true
        this.elm.root.style.display = "flex"
    }
    private close(){
        this.opened = false
        this.elm.root.style.display = "none"
    }
}