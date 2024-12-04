import { h } from "../../common/dom"
import style from "./style.module.css"
import { I_CommandEmmiter } from "../../lib/CommandEmmiter"
import { CommandEmiterListener } from "../../lib/EmiterCore"
import { scroll_to_focus_elm } from "../../common/scroll"


class FocusCycler<T> {
    private index: number | null

    constructor(
        private readonly ary: ReadonlyArray<T>
    ){
        if ( ary.length === 0 ){
            this.index = null
        }else{
            this.index = 0
        }
    }

    getFocusedItem(): T | null{
        if ( this.index === null ){
            return null
        }else{
            return this.ary[this.index]
        }
    }
    
    focusUp(){
        if ( this.index === null ){ return }
        
        this.index -= 1
        if ( this.index < 0 ){
            this.index = this.ary.length - 1
        }
    }

    focusDown(){
        if ( this.index === null ){ return }
        this.index += 1
        if ( this.index >= this.ary.length ){
            this.index = 0
        }
    }
}

class ItemDataElm {
    elm = h(`div.${style.itemroot}`,[
        h(`div.${style.title}@title`),
        h(`div.${style.tags}@tags`),
        h(`div.${style.desc}@desc`),
    ])

    constructor(
        public readonly data: Readonly<BkmkList.ItemData>
    ){
        this.elm.title.innerText = data.getTitle()
        this.elm.desc.innerText = data.getDesc()

        data.getTags().forEach( tag => {
            let elm = h(`span.${style.tag}`)
            elm.root.innerText = "#" + tag
            this.elm.tags.appendChild(elm.root)
        })
    }
}

export namespace BkmkList {
    export class Element {
        private focus = new FocusCycler<ItemDataElm>([])
        private elm = h(`div.${style.root}`)
        root = this.elm.root

        constructor(
            commandEmiter: I_CommandEmmiter
        ){
            this.setListener(commandEmiter)
        }

        private lis: CommandEmiterListener | null = null
        private setListener(commandEmiter: I_CommandEmmiter){
            this.lis = new CommandEmiterListener(
                ["bkmkList.focusUp",  () => { this.moveFocus("up") }],
                ["bkmkList.focusDown",() => { this.moveFocus("down") }],
            )
            commandEmiter.addWeakRefListener(this.lis)
        }
        
        private moveFocus(to: "up" | "down"){
            let prevFocusedItem = this.focus.getFocusedItem()
            if ( prevFocusedItem === null ){ return }
            prevFocusedItem.elm.root.classList.remove(style.focus)

            console.log("aaao")

            if ( to === "down" ){
                this.focus.focusDown()
            }else{
                this.focus.focusUp()
            }
            
            this.handleUpdateFocusElm()
        }
        
        private handleUpdateFocusElm(){
            let focusedItem = this.focus.getFocusedItem()
            if ( focusedItem === null ){ return }
            focusedItem.elm.root.classList.add(style.focus)
            scroll_to_focus_elm( focusedItem.elm.root, this.elm.root )
        }

        update(datas: ItemData[]){
            let elms = datas.map(d => new ItemDataElm(d))
            this.focus = new FocusCycler(elms)
            elms.forEach( elm => {
                this.elm.root.appendChild(elm.elm.root)
            })
            this.handleUpdateFocusElm()
        }
        
        getFocusedItem(): ItemData | null {
            let focused = this.focus.getFocusedItem()
            if ( focused === null ){ return null }
            return focused.data
        }
    }
    
    export interface ItemData {
        getTitle(): string
        getUrl(): string
        getTags(): string[]
        getDesc(): string
    }
}