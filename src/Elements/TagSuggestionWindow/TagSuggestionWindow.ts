import { Assert } from "../../common/Assert"
import { h } from "../../common/dom"
import { scroll_to_focus_elm } from "../../common/scroll"
import {  I_CommandEmmiter } from "../../lib/CommandEmmiter"
import { CommandEmiterListener } from "../../lib/EmiterCore"
import styles from "./style.module.css"


/**
 * static関数にするべきかもしれないが
 * namespaceの外から参照して欲しくないから
 * functionで書く
 */
function joinTextBlocks(blocks: TextBlock[]){
    let text = ""
    blocks.forEach( b => { text += b.text })
    return text
}

function generateTextBlockElm(text: TextBlock, settings: TagSuggestionWindow.Setting){
    const elm = h("span")
    elm.root.innerText = text.text
    if ( text.match ){
        elm.root.style.color = settings.matchTextColor
    }else{
        elm.root.style.color = settings.unmatchTextColor
    }
    return elm
}

function generateItemElm(item: ItemData,settings: TagSuggestionWindow.Setting){
    const elm = h(`div.${styles.itemelm}`,[
        
    ])
    
    let textBlockElms = item.textBlocks().map( t => generateTextBlockElm(t,settings) )
    
    textBlockElms.forEach( e => {
        elm.root.appendChild(e.root)
    })
    
    return elm
}

class FocusIndex {

    private value: number | null = null
    private targetAryLength: number | null = null
    
    moveFocus(to: "up" | "down"){
        if ( this.targetAryLength === 0 ){
            return
        }
        Assert.isNotNull(this.value)
        Assert.isNotNull(this.targetAryLength)

        this.value += to === "up" ? -1 : 1

        if (to === "up" ? this.value < 0 : this.value >= this.targetAryLength){
            this.value = to === "up" ? this.targetAryLength -1 : 0
        }
    }

    /**
     * 要素の型は問わない
     */
    updateTargetAry(ary: Array<unknown>){
        this.targetAryLength = ary.length

        if ( ary.length == 0 ){
            this.value = null
            return
        }

        if ( this.value === null ){
            this.value = 0
            return
        }
        
        if ( ary.length <= this.value ){
            this.value = ary.length - 1
            return
        }
    }
    
    getOrThrow(): number {
        Assert.isNotNull(this.value)
        return this.value
    }
    
    get(): number | null {
        return this.value
    }
}

class TextBlock {
    constructor(
        public readonly text: string,
        public readonly match: boolean
    ){ }
}

class ItemData {
    constructor(
        private predicate: string, 
        private tagText: string
    ){ }

    textBlocks(): TextBlock[] {
        let splited = this.tagText.split(this.predicate)
        if ( splited.length === 1 ){
            splited.unshift(this.predicate)
        }else if ( splited.length > 1 ){
            let newSplited = []
            newSplited.push(splited.shift()!)
            newSplited.push(this.predicate)
            newSplited.push(splited.join(this.predicate))
            splited = newSplited
        }else{
            throw new Error("?")
        }
        return splited.map( text => new TextBlock(text, text === this.predicate))
    }
}

class TagFinderWraper {
    constructor(
        private readonly finder: TagSuggestionWindow.TagFinder
    ){}
    
    async find(predicate: string){
        let result = await this.finder.find(predicate)
        let itemDatas = result.map( res => new ItemData(predicate, res) )
        return itemDatas
    }
}

class DefaultSettings implements TagSuggestionWindow.Setting {
    matchTextColor: string = "white"
    unmatchTextColor: string = "gray"
    width: number = 200;
    maxHeightPx: number = 350;
    backgroundColor: string = "rgb(20,20,20)"
    focusBackgroundColor: string = "rgb(40,40,40)"
}


//----------------------------------------------------------------------------------------------------//
//                                                                                                    //
//                                               PUBLIC                                               //
//                                                                                                    //
//----------------------------------------------------------------------------------------------------//

export namespace TagSuggestionWindow {

    export interface Setting {
        readonly width: number
        readonly maxHeightPx: number
        readonly backgroundColor: string
        readonly focusBackgroundColor: string
        readonly matchTextColor: string
        readonly unmatchTextColor: string
    }

    /**
     * DBのラッパーがこのインターフェースを満たしたクラスのインスタンスを生成する予定
     */
    export interface TagFinder {
        find(predicate: string): Promise<string[]>
    }
    
    export class Element {
        private focusIndex = new FocusIndex()
        private settings: TagSuggestionWindow.Setting
        private tagFinderWraper: TagFinderWraper
        private elm = h(`div.${styles.root}`,[
            
        ])
        
        private items: {
            data: ItemData
            elm:ReturnType<typeof generateItemElm>
        }[] = []


        private clearFocusFromHtml(){
            this.items[this.focusIndex.getOrThrow()].elm.root.style.backgroundColor = ""
        }
        private focusHtml(){
            this.items[this.focusIndex.getOrThrow()].elm.root.style.backgroundColor = this.settings.focusBackgroundColor
            scroll_to_focus_elm(
                this.items[this.focusIndex.getOrThrow()].elm.root,
                this.elm.root
            )
        }
        private updateItems(itemDatas: ItemData[]){
            this.items = itemDatas.map( data => {
                return {
                    elm: generateItemElm(data,this.settings),
                    data
                }
            })
            

            this.elm.root.innerHTML = ""

            this.focusIndex.updateTargetAry(this.items)

            if ( this.items.length === 0 ){
                this.hide()
                return
            }else{
                this.show()
            }

            this.items.forEach( item => {
                this.elm.root.appendChild(item.elm.root)
            })
            
            this.focusHtml()
        }
        
        private hide(){
            this.elm.root.style.display = "none"
        }
        private show(){
            this.elm.root.style.display = "block"
        }
        
        private listener: CommandEmiterListener

        //
        // public
        //
        constructor(
            tagFinder: TagFinder,
            commandEmmiter: I_CommandEmmiter,
            settings?: TagSuggestionWindow.Setting
        ){
            
            this.listener = new CommandEmiterListener(
                ["tagSuggestionWindow.focusDown",() => { this.moveFocus("down") }],
                ["tagSuggestionWindow.focusUp",() => { this.moveFocus("up") }],
            )

            commandEmmiter.addWeakRefListener(this.listener)

            this.tagFinderWraper = new TagFinderWraper(tagFinder)

            if ( settings ){
                this.settings = settings
            }else{
                this.settings = new DefaultSettings()
            }
            

            this.elm.root.style.width = `${this.settings.width}px`
            this.elm.root.style.maxHeight = `${this.settings.maxHeightPx}px`
            this.elm.root.style.backgroundColor = this.settings.backgroundColor
            

            this.hide()
        }

        root: HTMLElement = this.elm.root


        async update(predicate: string){
            let itemDatas = await this.tagFinderWraper.find(predicate)
            this.updateItems(itemDatas)
        }

        private moveFocus(to: "up" | "down"){
            if ( this.focusIndex.get() === null ){
                return
            }

            this.clearFocusFromHtml()
            this.focusIndex.moveFocus(to)
            this.focusHtml()
        }

        setWindowPos(topPx:number, leftPx: number){
            this.elm.root.style.left = leftPx + "px"
            this.elm.root.style.top  = topPx + "px"
        }

        getFocused(): string | null{
            let index = this.focusIndex.get()
            if ( index === null ){
                return null
            }
            return joinTextBlocks(this.items[index].data.textBlocks())
        }
    }
}