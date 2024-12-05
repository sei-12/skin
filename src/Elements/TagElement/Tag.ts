import { h } from "../../common/dom";
import style from "./style.module.css"



export class TagElement {
    private elm = h(`div.${style.root}`,[
        h(`div.${style.textbox}@textbox`),
        h(`button.${style.removebtn}@removebtn`), 
    ])
    
    public readonly instanceId = crypto.randomUUID()
    onclickRemoveBtn = (_instanceId: string) => {}

    root = this.elm.root

    constructor(
        public readonly text: string,
        public readonly exists: boolean
    ){
        this.elm.textbox.innerText = this.text
        this.elm.textbox.classList.add( exists ? style.exists : style.notexists )
        
        this.elm.removebtn.addEventListener("click",() => {
            this.onclickRemoveBtn(this.instanceId)
        })
    }
}