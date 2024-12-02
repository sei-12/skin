import { Assert } from "../../common/Assert"
import { h } from "../../common/dom"
import { scroll_to_focus_elm } from "../../common/scroll"
import styles from "./style.module.css"


/**
 * static関数にするべきかもしれないが
 * namespaceの外から参照して欲しくないから
 * functionで書く
 */
function joinTextBlocks(blocks: TagSuggestionWindow.TextBlock[]){
    let text = ""
    blocks.forEach( b => { text += b.text })
    return text
}

function generateTextBlockElm(text: TagSuggestionWindow.TextBlock, settings: TagSuggestionWindow.Setting){
    const elm = h("span")
    elm.root.innerText = text.text
    if ( text.match ){
        elm.root.style.color = settings.matchTextColor
    }else{
        elm.root.style.color = settings.unmatchTextColor
    }
    return elm
}

function generateItemElm(item: TagSuggestionWindow.ItemData,settings: TagSuggestionWindow.Setting){
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
}

export namespace TagSuggestionWindow {
    

    export class TextBlock {
        constructor(
            public readonly text: string,
            public readonly match: boolean
        ){ }
    }

    export interface ItemData {
        textBlocks():TextBlock[]
    }

    export interface Setting {
        readonly width: number
        readonly maxHeightPx: number
        readonly backgroundColor: string
        readonly focusBackgroundColor: string
        readonly matchTextColor: string
        readonly unmatchTextColor: string
    }

    class DefaultSettings implements Setting {
        matchTextColor: string = "white"
        unmatchTextColor: string = "gray"
        width: number = 200;
        maxHeightPx: number = 350;
        backgroundColor: string = "rgb(20,20,20)"
        focusBackgroundColor: string = "rgb(40,40,40)"
    }
    

    /**
     * TODO: 複数のクラスに分けたい
     */
    export class Element {
        static readonly NUM_MAX_ITEMS = 100

        private focusIndex = new FocusIndex()
        private settings: TagSuggestionWindow.Setting
        private elm = h(`div.${styles.root}`,[
            
        ])
        
        private items: {
            data: TagSuggestionWindow.ItemData
            elm:ReturnType<typeof generateItemElm>
        }[] = []


        private clearFocusFromHtml(){
            this.items[this.focusIndex.getOrThrow()].elm.root.style.backgroundColor = ""
        }
        private focusHtml(){
            this.items[this.focusIndex.getOrThrow()].elm.root.style.backgroundColor = this.settings.focusBackgroundColor
        }
        
        
        //
        // public
        //
        
        constructor(settings?: TagSuggestionWindow.Setting){
            if ( settings ){
                this.settings = settings
            }else{
                this.settings = new DefaultSettings()
            }
            

            this.elm.root.style.width = `${this.settings.width}px`
            this.elm.root.style.maxHeight = `${this.settings.maxHeightPx}px`
            this.elm.root.style.backgroundColor = this.settings.backgroundColor
        }

        root: HTMLElement = this.elm.root

        updateItems(itemDatas: TagSuggestionWindow.ItemData[]){
            Assert.isTrue(itemDatas.length <= Element.NUM_MAX_ITEMS)

            this.items = itemDatas.map( data => {
                return {
                    elm: generateItemElm(data,this.settings),
                    data
                }
            })
            this.elm.root.innerHTML = ""
            this.items.forEach( item => {
                this.elm.root.appendChild(item.elm.root)
            })
            
            this.focusIndex.updateTargetAry(this.items)
            this.focusHtml()
        }

        moveFocus(to: "up" | "down"){
            this.clearFocusFromHtml()
            this.focusIndex.moveFocus(to)
            this.focusHtml()
            scroll_to_focus_elm(
                this.items[this.focusIndex.getOrThrow()].elm.root,
                this.elm.root
            )
        }

        getFocused(){
            return joinTextBlocks(this.items[this.focusIndex.getOrThrow()].data.textBlocks())
        }
    }
}