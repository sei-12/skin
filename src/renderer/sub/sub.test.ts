import { HotkeyMap, When } from "./sub"


test("When", () => {
    let when = new When([], "anypage")
    expect(when.match("pages:add", [])).toBe(true)
    expect(when.match("pages:add", ["tag_suggestion"])).toBe(false)


    let when1 = new When([], "pages:add")
    expect(when1.match("pages:add", [])).toBe(true)
    expect(when1.match("pages:add", ["tag_suggestion"])).toBe(false)
    expect(when1.match("pages:home", [])).toBe(false)

    let when2 = new When(["tag_suggestion"], "anypage")
    expect(when2.match("pages:add", [])).toBe(false)
    expect(when2.match("pages:add", ["tag_suggestion"])).toBe(true)

    let when3 = new When(["tag_suggestion"], "pages:add")
    expect(when3.match("pages:add", [])).toBe(false)
    expect(when3.match("pages:add", ["tag_suggestion"])).toBe(true)
    expect(when3.match("pages:home", [])).toBe(false)
    expect(when3.match("pages:home", ["tag_suggestion"])).toBe(false)
})


test("HotkeyMap", () => {
    let hotkey_map = new HotkeyMap()

    hotkey_map.set_hotkey("ctrl+n", new When([], "anypage"), () => "test1")
    hotkey_map.set_hotkey("a", new When([], "pages:add"), () => "test2")
    hotkey_map.set_hotkey("ctrl+n", new When([], "pages:add"), () => "test3")

    let test1 = hotkey_map.get_hotkey("pages:home", "ctrl+n", [])

    let test2 = hotkey_map.get_hotkey("pages:add", "a", [])
    let test3 = hotkey_map.get_hotkey("pages:add", "ctrl+n", [])
    let undef = hotkey_map.get_hotkey("pages:add", "ctrl+a", [])

    if (test1 === null || test2 === null || test3 === null) {
        throw Error()
    }

    expect(test1()).toBe("test1")
    expect(test2()).toBe("test2")
    expect(test3()).toBe("test3")
    expect(undef).toBeNull()

})
