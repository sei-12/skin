import { expect, it } from "vitest";
import { BkmkList } from "./lib";
import { CommandEmiterCore } from "../../lib/CommandEmmiter";

class BkmkItemData implements BkmkList.ItemData {

    constructor(
        private title: string
    ){}
    getTitle(): string {
        return this.title
    }

    getUrl(): string {
        return ""
    }
    getTags(): string[] {
        return []
    }
    getDesc(): string {
        return ""
    }

}

it("BkmkList",() => {
    const emiter = new CommandEmiterCore()

    {
        const elm = new BkmkList.Element(emiter)
        elm.update([
            new BkmkItemData("hello"),
        ])
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello")
    }

    {
        const elm = new BkmkList.Element(emiter)
        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("hello2"),
            new BkmkItemData("hello3"),
        ])
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello3")
        expect(((elm as any).elm.root as HTMLElement).childNodes.length).toBe(3)

        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("hello2"),
            new BkmkItemData("hello3"),
            new BkmkItemData("hello4"),
        ])
        expect(((elm as any).elm.root as HTMLElement).childNodes.length).toBe(4)
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello4")
    }

    {
        const elm = new BkmkList.Element(emiter)
        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("hello2"),
            new BkmkItemData("hello3"),
        ])
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello2")
    }
    
    {
        const elm = new BkmkList.Element(emiter)
        elm.update([ ])
        expect(elm.getFocusedItem()).toBe(null)
    }
    
    {// 物量で挙動が変わっていないかどうかを検証
        const elm = new BkmkList.Element(emiter)
        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("aaa"),
            new BkmkItemData("ma"),
            new BkmkItemData("rrr"),
            new BkmkItemData("sss"),
            new BkmkItemData("hello4"),
            new BkmkItemData("hello7"),
            new BkmkItemData("hello9"),
            new BkmkItemData("hello10"),
            new BkmkItemData("aaa0aaa"),
            new BkmkItemData("aaauuubb"),
            new BkmkItemData("foo"),
        ])

        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("focusBkmkPredicateInputbox")
        emiter.emit("tagSuggestionWindow.focusDown")
        emiter.emit("tagSuggestionWindow.Done")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        
        Array(100).fill(null).forEach(_ => {
            emiter.emit("bkmkList.focusDown")
        })
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()

    }

    {// 物量で挙動が変わっていないかどうかを検証
        const elm = new BkmkList.Element(emiter)
        elm.update([
            new BkmkItemData("aa aaa aaああああいいいルウ"),
            new BkmkItemData("71937272810139e47230138470w98e7012634"),
            new BkmkItemData("098410984717838"),
            new BkmkItemData("'!(!!)('&%#$!&!'#()#=~0(#)*+}{_?><><>L<?{}`{||~=0)(¥\"\n"),
            new BkmkItemData("'!(!!)('&%#$!&!'#\t\n\n\\{||~=0)(¥\"\n"),
            new BkmkItemData("sss!¥\"#$%&'()0=-~^|¥`@[{]]}*:+;<,>./_?__"),
            new BkmkItemData("aaaaaaaaaa".repeat(1000)),
            new BkmkItemData("'!(!!)('&%#$!&!'#\t\n\n\\{||~=0)(¥\"\n".repeat(100)),
        ])

        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("bkmkList.focusDown")
        emiter.emit("bkmkList.focusDown")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        emiter.emit("focusBkmkPredicateInputbox")
        emiter.emit("tagSuggestionWindow.focusDown")
        emiter.emit("tagSuggestionWindow.Done")
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()
        
        Array(100).fill(null).forEach(_ => {
            emiter.emit("bkmkList.focusDown")
        })
        expect(elm.getFocusedItem()?.getTitle()).toMatchSnapshot()

        elm.update([
            new BkmkItemData("hello"),
        ])
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello")
        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("hello2"),
            new BkmkItemData("hello3"),
        ])
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello2")
        elm.update([
            new BkmkItemData("hello"),
            new BkmkItemData("hello 2"),
            new BkmkItemData("hello3"),
        ])
        emiter.emit("bkmkList.focusUp")
        emiter.emit("bkmkList.focusUp")
        expect(elm.getFocusedItem()?.getTitle()).toBe("hello 2")

    }
})