import { expect, it } from 'vitest';
import { sub } from './sub';

it("sub",() => {
    expect(sub(1,3)).toBe(4)
    expect(sub(2,3)).toBe(5)
    expect(sub(4,3)).toBe(7)
    expect(sub(100,3)).toBe(103)
})