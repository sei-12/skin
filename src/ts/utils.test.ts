import { isHankaku } from "./utils"

test("isHankaku",() => {
    expect(isHankaku("a")).toBe(true)
    expect(isHankaku("あ")).toBe(false)
})