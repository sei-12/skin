import { Assert } from "../../common/Assert"
import { h } from "../../common/dom"
import styles from "./style.module.css"

export namespace TagSuggestionWindow {
    
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

        private focusIndex: number | null = null
        private settings: TagSuggestionWindow.Setting
        private elm = h(`div.${styles.root}`,[
            
        ])
        
        private items: {
            data: TagSuggestionWindow.ItemData
            elm:ReturnType<TagSuggestionWindow.Element["generateItemElm"]>
        }[] = []

        private generateTextBlock(text: TextBlock){
            const elm = h("span")
            elm.root.innerText = text.text
            if ( text.match ){
                elm.root.style.color = this.settings.matchTextColor
            }else{
                elm.root.style.color = this.settings.unmatchTextColor
            }
            return elm
        }

        private generateItemElm(item: TagSuggestionWindow.ItemData){
            const elm = h(`div.${styles.itemelm}`,[
                
            ])
            
            let textBlockElms = item.textBlocks().map( t => this.generateTextBlock(t) )
            
            textBlockElms.forEach( e => {
                elm.root.appendChild(e.root)
            })
            
            return elm
        }
        private updateFocusIndex(){
            if ( this.items.length <= 0 ){
                this.focusIndex = null
                return
            }

            if ( this.focusIndex === null ){
                this.focusIndex = 0
                return
            }
            
            if ( this.items.length <= this.focusIndex ){
                this.focusIndex = this.items.length - 1
                return
            }
        }
        
        private clearFocusFromHtml(){
            if ( this.items.length === 0 ){
                return
            }
            
            Assert.isNotNull(this.focusIndex)

            this.items[this.focusIndex].elm.root.style.backgroundColor = ""
        }
        private focusHtml(){
            if ( this.items.length === 0 ){
                return
            }
            
            Assert.isNotNull(this.focusIndex)

            this.items[this.focusIndex].elm.root.style.backgroundColor = this.settings.focusBackgroundColor
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
                    elm: this.generateItemElm(data),
                    data
                }
            })
            this.elm.root.innerHTML = ""
            this.items.forEach( item => {
                this.elm.root.appendChild(item.elm.root)
            })
            
            this.updateFocusIndex()
            this.focusHtml()
        }

        private moveFocus(to: "up" | "down"){
            if ( this.items.length === 0 ){
                return
            }
            Assert.isNotNull(this.focusIndex)

            this.clearFocusFromHtml()

            this.focusIndex += to === "up" ? -1 : 1

            if (to === "up" ? this.focusIndex < 0 : this.focusIndex >= this.items.length){
                this.focusIndex = to === "up" ? this.items.length -1 : 0
            }

            this.focusHtml()
        }

        focusUp(){
            this.moveFocus("up")
        }
        focusDown(){
            this.moveFocus("down")
        }

        getFocused(){
            if ( this.items.length === 0 ){
                return
            }
            Assert.isNotNull(this.focusIndex)
            return joinTextBlocks(this.items[this.focusIndex].data.textBlocks())
        }
    }
}