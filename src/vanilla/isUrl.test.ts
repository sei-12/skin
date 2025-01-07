import { describe, expect, test  } from "vitest";
import { isUrl } from "./isUrl";

describe("isUrl",() => {
    test("test1",() => {
        expect(isUrl("https://hello_world")).toBe(true)
        expect(isUrl("https://hello_world/aaa")).toBe(true)
        expect(isUrl("https://hello_world/a/aaa?a=1")).toBe(true)
        expect(isUrl("http://hello_world/a/aaa?a=1")).toBe(true)
        expect(isUrl("http://hello_world")).toBe(true)
        expect(isUrl("http://hello_world/aaa")).toBe(true)
    })
    test("test2",() => {
        expect(isUrl("a://hello_world")).toBe(false)
        expect(isUrl("b://hello_world/aaa")).toBe(false)
        expect(isUrl("c://hello_world/a/aaa?a=1")).toBe(false)
        expect(isUrl("http:aaaa")).toBe(false)
        expect(isUrl("hello world")).toBe(false)
    })
})