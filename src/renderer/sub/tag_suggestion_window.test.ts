import { __local__ } from "./tag_suggestion_window"

test("create_suggesion_list_elm",() => {
    let test1 = __local__.create_suggestion_list_item("hello",{
        id: 1,
        name: "hello",
        oto: "hello"
    })
    expect(test1 instanceof HTMLDivElement).toBe(true)


    let test2 = __local__.create_suggestion_list_item("aaa",{
        id: 1,
        name: "hello",
        oto: "hello"
    })
    expect(test2).toBeNull()
})