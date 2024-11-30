import { TagSuggestionWindow } from "./Elements/TagSuggestionWindow/TagSuggestionWindow"

class DecoyItemData implements TagSuggestionWindow.ItemData {
    textBlocks(): TagSuggestionWindow.TextBlock[] {
        return [
            new TagSuggestionWindow.TextBlock("hel",true),
            new TagSuggestionWindow.TextBlock("lllllloooo",false),
        ]
    }    
}
const elm = new TagSuggestionWindow.Element()

let numDatas = 100
let datas = Array(numDatas).fill( new DecoyItemData() )
elm.updateItems(datas)

document.body.appendChild(elm.root)

setInterval(() => {
    elm.focusDown()
},3000)