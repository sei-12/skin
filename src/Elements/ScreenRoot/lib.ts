import { h } from "../../common/dom";
import style from "./style.module.css"
import { CommandEmiterListener, I_CommandEmiter } from "../../lib/CommandEmmiter";
import { BkmkList } from "../BkmkList/lib";
import { BkmkPredicate, BkmkPredicateInputBox } from "../BkmkPredicateInputBox/BkmkPredicateInputBox";
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow";
import { BkmkCreater, CreateNewBkmkForm } from "../CreateNewBkmk/lib";
import { ShourtcutScopeManager } from "../../lib/ShourtcutScopeManager";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";



export interface BkmkFinder {
    find(predicate: BkmkPredicate):  Promise<BkmkList.ItemData[]> 
}
export interface BookmarkRemover {
    remove(bkmkid: number): Promise<void>
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

    private listener = new CommandEmiterListener(
        ["openBookmark",() => { this.openBookmark() }]
    )
    
    private openBookmark(){
        let item = this.bkmkList.getFocusedItem()
        if ( item === null ){
            return
        }

        invoke("open_url",{url: item.getUrl()})
    }

    private async handleOnclickRemove(id: number){
        if (!( await confirm("ブックマークを削除します") )){
            return
        }
        
        await this.bkmkRemover.remove(id)
        this.updateBkmklist()
    }

    private async updateBkmklist(){
        let p = this.predicateInputBox.getPredicate()
        if ( p.isEmpty() ){
            this.bkmkList.update([])
            return
        }
        let bkmks = await this.bkmkFinder.find(p)
        this.bkmkList.update(bkmks)
    }

    constructor(
        tagFinder: TagSuggestionWindow.TagFinder,
        bkmkFinder: BkmkFinder,
        commandEmiter: I_CommandEmiter,
        bkmkCreater: BkmkCreater,
        shoutcutScopeManager: ShourtcutScopeManager,
        private bkmkRemover: BookmarkRemover
    ){
        this.bkmkFinder = bkmkFinder
        this.bkmkList = new BkmkList.Element(
            commandEmiter,
            id => this.handleOnclickRemove(id)
        )

        this.predicateInputBox = new BkmkPredicateInputBox(
            tagFinder,
            commandEmiter,
            shoutcutScopeManager
        )
        
        commandEmiter.addWeakRefListener(this.listener)
        
        this.predicateInputBox.setHandleOnChange(async () => {
            this.updateBkmklist()
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