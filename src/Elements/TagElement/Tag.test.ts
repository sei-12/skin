import { expect, it } from 'vitest';
import { TagElement } from './Tag';

it("TagElement", () => {
    const elm = new TagElement("hello",false)
    expect((elm as any).elm.textbox.innerText).toBe("hello")
})