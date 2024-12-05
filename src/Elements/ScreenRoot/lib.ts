import { h } from "../../common/dom";
import style from "./style.module.css"
import { I_CommandEmmiter } from "../../lib/CommandEmmiter";
import { BkmkList } from "../BkmkList/lib";
import { BkmkPredicate, BkmkPredicateInputBox } from "../BkmkPredicateInputBox/BkmkPredicateInputBox";
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow";



export interface BkmkFinder {
    find(predicate: BkmkPredicate):  Promise<BkmkList.ItemData[]> 
}

export class ScreenRootElement {
    private static generateElm(){
        return h(`div.${style.root}`)
    }

    private elm = ScreenRootElement.generateElm()
    private bkmkList: BkmkList.Element
    private predicateInputBox: BkmkPredicateInputBox
    private bkmkFinder: BkmkFinder

    public root = this.elm.root

    constructor(
        tagFinder: TagSuggestionWindow.TagFinder,
        bkmkFinder: BkmkFinder,
        commandEmiter: I_CommandEmmiter
    ){
        this.bkmkFinder = bkmkFinder
        this.bkmkList = new BkmkList.Element(
            commandEmiter
        )

        this.predicateInputBox = new BkmkPredicateInputBox(
            tagFinder,
            commandEmiter
        )

        this.elm.root.appendChild(this.predicateInputBox.root)
        this.elm.root.appendChild(this.bkmkList.root)
        
        this.predicateInputBox.setHandleOnChange(async () => {
            let p = this.predicateInputBox.getPredicate()
            if ( p.isEmpty() ){
                this.bkmkList.update([])
                return
            }
            let bkmks = await this.bkmkFinder.find(p)
            this.bkmkList.update(bkmks)
        })
    }
}