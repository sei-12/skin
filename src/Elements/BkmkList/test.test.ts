import { expect, it } from "vitest";
import { BkmkList } from "./lib";
import { CommandEmiterCore } from "../../lib/EmiterCore";

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
})