import { expect, it } from "vitest";
import { TagSuggestionWindow } from "./TagSuggestionWindow";

class DecoyItemData implements TagSuggestionWindow.ItemData {
    textBlocks(): TagSuggestionWindow.TextBlock[] {
        return [
            new TagSuggestionWindow.TextBlock("hel",true),
            new TagSuggestionWindow.TextBlock("l",true),
            new TagSuggestionWindow.TextBlock("o",true),
        ]
    }    
}

it("TagSuggestionWindow:whitebox",() => {
    const elm = new TagSuggestionWindow.Element()
    
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
    
    expect(elm.root.style.maxHeight).toBe("150px")
    expect(elm.root.style.width).toBe("200px")
})

it("TagSuggestionWindow:blackbox",() => {
    const elm = new TagSuggestionWindow.Element()
    
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
    
    expect(elm.getNumItems()).toBe(numDatas)
})