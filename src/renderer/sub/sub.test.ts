import { HotkeyMap, When, create_new_tag_element, get_inputed_tags } from "./sub"


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

test("create_new_tag_element", () => {
    let test1 = create_new_tag_element("hello", true)
    expect(test1.innerText).toBe("hello")
    expect(test1.classList.contains("tag")).toBe(true)
    expect(test1.classList.contains("tag-exists-db")).toBe(true)
    expect(test1.classList.contains("tag-not-exists-db")).toBe(false)

    let test2 = create_new_tag_element("hello", false)
    expect(test2.innerText).toBe("hello")
    expect(test2.classList.contains("tag")).toBe(true)
    expect(test2.classList.contains("tag-exists-db")).toBe(false)
    expect(test2.classList.contains("tag-not-exists-db")).toBe(true)
})

test("get_inputed_tags", () => {
    { // case1
        let tag_elms = [
            create_new_tag_element("test1", true),
            create_new_tag_element("test2", true),
            create_new_tag_element("test3", false),
            create_new_tag_element("test4", true),
            create_new_tag_element("test5", false)
        ]

        let elm = document.createElement("div")

        tag_elms.forEach(t => elm.appendChild(t))

        let tags = get_inputed_tags(elm)

        expect(tags).toEqual([
            "test1",
            "test2",
            "test3",
            "test4",
            "test5",
        ])
    }

    { // case2
        let tag_elms: HTMLElement[] = []

        let elm = document.createElement("div")

        tag_elms.forEach(t => elm.appendChild(t))

        let tags = get_inputed_tags(elm)

        expect(tags).toEqual([])
    }
})