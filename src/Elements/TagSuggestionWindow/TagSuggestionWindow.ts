import { h } from "../../common/dom"
import styles from "./style.module.css"

export interface TagSuggestionWindowItemData {
    text(): string    
}

export interface TagSuggestionWindowSettings {
    readonly maxWidthPx: number
    readonly maxHeightPx: number
}


class DefaultWindowSettings implements TagSuggestionWindowSettings {
    maxWidthPx: number = 100;
    maxHeightPx: number = 100;
}

export class TagSuggestionWindow {
    

    private settings: TagSuggestionWindowSettings
    private elm = h(`div.${styles.root}`,[
        
    ])
    
    private items: ReturnType<TagSuggestionWindow["generateItemElm"]>[] = []

    private generateItemElm(item: TagSuggestionWindowItemData){
        const elm = h(`div.${styles.itemelm}`,[
            
        ])
        
        elm.root.innerText = item.text()
        
        return elm
    }

    constructor(settings?: TagSuggestionWindowSettings){
        if ( settings ){
            this.settings = settings
        }else{
            this.settings = new DefaultWindowSettings()
        }
        

        this.elm.root.style.maxWidth = `${this.settings.maxWidthPx}px`
        this.elm.root.style.maxHeight = `${this.settings.maxHeightPx}px`
    }

    root: HTMLElement = this.elm.root

    updateItems(itemDatas: TagSuggestionWindowItemData[]){
        this.items = itemDatas.map( data => this.generateItemElm(data) )
        this.elm.root.innerHTML = ""
        this.items.forEach( item => {
            this.elm.root.appendChild(item.root)
        })
    }
    getNumItems(){
        return this.items.length
    }
    focusUp(){
        
    }
    focusDown(){
        
    }
}
