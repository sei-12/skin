import { TagElement } from "./Elements/Tag/Tag";

const elms: TagElement[] = [
    new TagElement("HelloWorld",true),
    new TagElement("TS",true),
    new TagElement("TypeScript",true),
    new TagElement("JavaScript",true),
    new TagElement("Git",true),
    new TagElement(crypto.randomUUID(),false),
    new TagElement(crypto.randomUUID(),false),
    new TagElement(crypto.randomUUID(),false),
    new TagElement(crypto.randomUUID(),true),
    new TagElement(crypto.randomUUID(),true),
    new TagElement("hello",true),
]

elms.forEach( elm => {
    document.body.appendChild(elm.root)
})
