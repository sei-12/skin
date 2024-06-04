import { checkNewTag } from "./checkNewTag"

jest.mock("../ts/db",() => ({
    DbAPI:{
        existsTag: (tag: string) => {
            const db = ["hello","aaaa"]
            return db.indexOf(tag) != -1
        }
    }
}))

test("checkNewTag",async () => {
    let res

    res = await checkNewTag("hello")
    expect(res.isErr).toBe(true)
    expect(res.errMessages.length).toBe(1)

    res = await checkNewTag("aaa")
    expect(res.isErr).toBe(false)
    expect(res.errMessages.length).toBe(0)

    res = await checkNewTag("a".repeat(32))
    expect(res.isErr).toBe(false)
    expect(res.errMessages.length).toBe(0)

    res = await checkNewTag("a".repeat(33))
    expect(res.isErr).toBe(true)

    res = await checkNewTag("あ")
    expect(res.isErr).toBe(true)
    expect(res.errMessages.length).toBe(1)

    res = await checkNewTag("あ".repeat(33))
    expect(res.isErr).toBe(true)
    expect(res.errMessages.length).toBe(2)
 
})