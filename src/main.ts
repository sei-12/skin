import { TagSuggestionWindow, TagSuggestionWindowItemData } from "./Elements/TagSuggestionWindow/TagSuggestionWindow"


class DecoyItemData implements TagSuggestionWindowItemData {
    text(): string {
        return "hello"
    }    
}

const elm = new TagSuggestionWindow()

let numDatas = 100
let datas = Array(numDatas).fill( new DecoyItemData() )
elm.updateItems(datas)


document.body.appendChild(elm.root)