import { expect, it } from "vitest";
import { h } from "./dom";

function assertHTMLElement(elm: unknown){
    if (!( elm instanceof HTMLElement )){
        throw new Error("assertHTMLElement")        
    }
}

it("h",() => {
    let elm = h("div",[
        h("h1@title"),
    ])
    assertHTMLElement(elm.root)
    assertHTMLElement(elm.title)
    expect(elm.title instanceof HTMLHeadingElement).toBeTruthy()
})