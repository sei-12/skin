import { describe, expect, it, vi } from "vitest";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { act, renderHook } from "@testing-library/react";
import { useSuggestionWindow } from "./SuggestionWindow";

const DEFALT_TAGS: string[] = [
    "hello", "helloworld", "foo", "abcde"
] as const;

const makeMockedFindTagMethod = (tags?: string[]) => {
    let _tags: string[] = DEFALT_TAGS

    if (tags !== undefined) {
        _tags = tags
    }

    return vi.fn<FindTagMethod>(async (predicate, inputedTags) => {
        const inputedTagsSet = new Set(inputedTags)
        let filted = _tags

        filted = filted.filter(t => !inputedTagsSet.has(t))
        const a: [string, boolean][][] = filted.filter(t => t.includes(predicate)).map(t => [[t, true]])
        return a
    })
}

const makeMockedGetInputedTags = () => {
    return vi.fn<() => string[]>(() => {
        return []
    })
}



describe("useSuggestionWindow", () => {
    it("case1", async () => {
        const mocked_findTagMethod = makeMockedFindTagMethod()
        const mocked_getInputedTags = makeMockedGetInputedTags()

        const onClickItem = vi.fn()
        const hook = renderHook(() => useSuggestionWindow(
            mocked_findTagMethod,
            onClickItem,
            mocked_getInputedTags
        ))

        expect(hook.result.current.items).toEqual([])
        await act(async () => { hook.result.current.onChangePredicateInputBox("h") })
        expect(hook.result.current.items.length).toEqual(2)
        expect(hook.result.current.getFocusedItem()).toEqual("hello")
        act(() => { hook.result.current.focusDown() })
        expect(hook.result.current.getFocusedItem()).toEqual("helloworld")
        act(() => { hook.result.current.focusDown() })
        expect(hook.result.current.getFocusedItem()).toEqual("hello")
        act(() => { hook.result.current.focusUp() })
        expect(hook.result.current.getFocusedItem()).toEqual("helloworld")
        act(() => { hook.result.current.focusUp() })
        expect(hook.result.current.getFocusedItem()).toEqual("hello")

        await act(async () => { hook.result.current.onChangePredicateInputBox("f") })
        expect(hook.result.current.items.length).toEqual(1)
        expect(hook.result.current.getFocusedItem()).toEqual("foo")
        act(() => { hook.result.current.focusUp() })
        expect(hook.result.current.getFocusedItem()).toEqual("foo")
        act(() => { hook.result.current.focusDown() })
        expect(hook.result.current.getFocusedItem()).toEqual("foo")

        await act(async () => { hook.result.current.close() })
        expect(hook.result.current.items.length).toEqual(0)
        expect(hook.result.current.getFocusedItem()).toEqual("")
    })
})