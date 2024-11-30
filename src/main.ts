import { TagSuggestionWindow } from "./Elements/TagSuggestionWindow/TagSuggestionWindow"

class DecoyItemData implements TagSuggestionWindow.ItemData {
    private randomTextBlock(match: boolean){
        let len = Math.floor(Math.random() * 20)
        let uuid = crypto.randomUUID().replace("-","")
        return new TagSuggestionWindow.TextBlock(uuid.substring(1,len),match)
    }

    textBlocks(): TagSuggestionWindow.TextBlock[] {
        return [
            this.randomTextBlock(true),
            this.randomTextBlock(false),
        ]
    }    
}
const elm = new TagSuggestionWindow.Element()

let numDatas = 4
let datas = Array(numDatas).fill( new DecoyItemData() )
elm.updateItems(datas)

document.body.appendChild(elm.root)

setInterval(() => {
    console.log("hello")
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
},10000)