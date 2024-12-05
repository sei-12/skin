import { describe, it, expect } from "vitest";
import { Assert } from "./Assert"; // 上記のコードを含むモジュールをインポート

describe("Assert utility functions", () => {
    it("should not throw when value is not null", () => {
        const value = "not null";
        expect(() => Assert.isNotNull(value)).not.toThrow();
    });

    it("should throw AssertionError when value is null", () => {
        const value = null;
        expect(() => Assert.isNotNull(value)).toThrow(Assert.AssertionError);
    });

    it("should not throw when value is not undefined", () => {
        const value = 42;
        expect(() => Assert.isNotUndefined(value)).not.toThrow();
    });

    it("should throw AssertionError when value is undefined", () => {
        const value = undefined;
        expect(() => Assert.isNotUndefined(value)).toThrow(Assert.AssertionError);
    });

    it("should not throw when value is true", () => {
        const value = true;
        expect(() => Assert.isTrue(value)).not.toThrow();
    });

    it("should throw AssertionError when value is false", () => {
        const value = false;
        expect(() => Assert.isTrue(value)).toThrow(Assert.AssertionError);
    });
});