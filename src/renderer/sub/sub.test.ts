import { When } from "./sub"


test("When", () => {
    let when = new When([],"anypage")
    expect(when.match("pages:add",[])).toBe(true)
    expect(when.match("pages:add",["tag_suggestion"])).toBe(false)


    let when1 = new When([],"pages:add")
    expect(when1.match("pages:add",[])).toBe(true)
    expect(when1.match("pages:add",["tag_suggestion"])).toBe(false)
    expect(when1.match("pages:home",[])).toBe(false)

    let when2 = new When(["tag_suggestion"],"anypage")
    expect(when2.match("pages:add",[])).toBe(false)
    expect(when2.match("pages:add",["tag_suggestion"])).toBe(true)

    let when3 = new When(["tag_suggestion"],"pages:add")
    expect(when3.match("pages:add",[])).toBe(false)
    expect(when3.match("pages:add",["tag_suggestion"])).toBe(true)
    expect(when3.match("pages:home",[])).toBe(false)
    expect(when3.match("pages:home",["tag_suggestion"])).toBe(false)
})