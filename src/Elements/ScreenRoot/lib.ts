import { h } from "../../common/dom";
import style from "./style.module.css"
import { I_CommandEmiter } from "../../lib/CommandEmmiter";
import { BkmkList } from "../BkmkList/lib";
import { BkmkPredicate, BkmkPredicateInputBox } from "../BkmkPredicateInputBox/BkmkPredicateInputBox";
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow";
import { BkmkCreater, CreateNewBkmkForm } from "../CreateNewBkmk/lib";
import { ShourtcutScopeManager } from "../../lib/ShourtcutScopeManager";



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
    private createNewBkmkForm: CreateNewBkmkForm
    
    
    private bkmkFinder: BkmkFinder

    public root = this.elm.root

    constructor(
        tagFinder: TagSuggestionWindow.TagFinder,
        bkmkFinder: BkmkFinder,
        commandEmiter: I_CommandEmiter,
        bkmkCreater: BkmkCreater,
        shoutcutScopeManager: ShourtcutScopeManager,
    ){
        this.bkmkFinder = bkmkFinder
        this.bkmkList = new BkmkList.Element(
            commandEmiter
        )

        this.predicateInputBox = new BkmkPredicateInputBox(
            tagFinder,
            commandEmiter,
            shoutcutScopeManager
        )

        
        this.predicateInputBox.setHandleOnChange(async () => {
            let p = this.predicateInputBox.getPredicate()
            if ( p.isEmpty() ){
                this.bkmkList.update([])
                return
            }
            let bkmks = await this.bkmkFinder.find(p)
            this.bkmkList.update(bkmks)
        })

        this.createNewBkmkForm = new CreateNewBkmkForm(
            commandEmiter,
            tagFinder,
            shoutcutScopeManager,
            bkmkCreater,
        )
        
        this.elm.root.appendChild(this.predicateInputBox.root)
        this.elm.root.appendChild(this.bkmkList.root)
        this.elm.root.appendChild(this.createNewBkmkForm.root)
    }
}