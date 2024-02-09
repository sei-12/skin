import { CycleIndex } from "./sub"

test("CycleIndex", () => {
    let c = new CycleIndex(0)
    expect(c.minus(10).val).toBe(9)
    expect(c.plus(10).val).toBe(1)

    let c1 = new CycleIndex(3)
    expect(c1.plus(4).val).toBe(0)
    expect(c1.plus(0).val).toBe(0)
    expect(c1.minus(4).val).toBe(2)

})