import { expect, it } from "vitest";
import { TagSuggestionWindow, TagSuggestionWindowItemData } from "./TagSuggestionWindow";

class DecoyItemData implements TagSuggestionWindowItemData {
    text(): string {
        return "hello"
    }    
}

it("TagSuggestionWindow",() => {
    const elm = new TagSuggestionWindow()
    
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
    
    expect(elm.getNumItems()).toBe(numDatas)
})