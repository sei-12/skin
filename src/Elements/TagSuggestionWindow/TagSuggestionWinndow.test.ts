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
class ItemData2 implements TagSuggestionWindow.ItemData {
    private blocks: TagSuggestionWindow.TextBlock[]
    constructor(num: number){
        this.blocks = [
            new TagSuggestionWindow.TextBlock(""+num,true),
        ]
    }
    textBlocks(): TagSuggestionWindow.TextBlock[] {
        return this.blocks
    }    
}

it("TagSuggestionWindow:whitebox",() => {
    const elm = new TagSuggestionWindow.Element()
    
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
    
    expect(elm.root.style.maxHeight).toBe("350px")
    expect(elm.root.style.width).toBe("200px")
    expect(((elm as any).elm.root as HTMLElement).childNodes.length).toBe(numDatas)
    

    {
        const elm = new TagSuggestionWindow.Element()
        
        let numDatas = 100
        let datas: TagSuggestionWindow.ItemData[] = []
        for (let i = 0; i < numDatas; i++) {
            datas.push(new ItemData2(i))
        }

        elm.updateItems(datas)
        
        elm.focusUp()
        expect(elm.getFocused()).toBe("99")
        
        Array(5).fill(0).forEach(() => elm.focusUp())
        expect(elm.getFocused()).toBe("94")
        
    }
})

it("TagSuggestionWindow:blackbox",() => {
    const elm = new TagSuggestionWindow.Element()
    
    let numDatas = 100
    let datas = Array(numDatas).fill( new DecoyItemData() )
    elm.updateItems(datas)
    
    expect(elm.getFocused()).toBe("hello")
})