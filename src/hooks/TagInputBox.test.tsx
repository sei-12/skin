import { expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { render, renderHook, screen } from "@testing-library/react";
// import { TextField } from "@mui/material";
import userEvent from "@testing-library/user-event";
import { useTagInputBox } from "./TagInputBox";
import { act } from "react";
import { startMockDB } from "../services/database.test";

const DEFALT_TAGS: string[] = ["hello", "helloworld", "foo", "abcde"] as const;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
const makeMockedFindTagMethod = (tags?: string[]) => {
    let _tags: string[] = DEFALT_TAGS;

    if (tags !== undefined) {
        _tags = tags;
    }

    return vi.fn<FindTagMethod>(async (predicate, inputedTags) => {
        const inputedTagsSet = new Set(inputedTags);
        let filted = _tags;

        filted = filted.filter((t) => !inputedTagsSet.has(t));
        const a: [string, boolean][][] = filted
            .filter((t) => t.includes(predicate))
            .map((t) => [[t, true]]);
        return a;
    });
};

test("useTagInputBox", async () => {
    const mocked_findTagMethod = makeMockedFindTagMethod();
    startMockDB();

    const hook = renderHook(() => useTagInputBox(mocked_findTagMethod));
    render(
        <input
            data-testid="inputbox"
            onChange={(e) => {
                hook.result.current.suggestionWindowHook.onChangePredicateInputBox(
                    e.target.value,
                );
            }}
            ref={hook.result.current.inputBoxRef}
        />,
    );
    const inputBox = screen.getByTestId<HTMLInputElement>("inputbox");

    expect(inputBox).toBeInTheDocument();
    await userEvent.type(inputBox, "h");
    expect(inputBox.value).toBe("h");
    expect(hook.result.current.suggestionWindowHook.items.length).toEqual(2);
    expect(hook.result.current.suggestionWindowHook.getFocusedItem()).toEqual(
        "hello",
    );
    await act(async () => {
        hook.result.current.addFocusedSuggestionItem();
    });
    expect(hook.result.current.inputedTags.length).toBe(1);
    expect(hook.result.current.suggestionWindowHook.items.length).toEqual(0);
    expect(inputBox.value).toBe("");

    await userEvent.type(inputBox, "h");
    expect(inputBox.value).toBe("h");
    expect(hook.result.current.suggestionWindowHook.items.length).toEqual(1);
    expect(hook.result.current.suggestionWindowHook.getFocusedItem()).toEqual(
        "helloworld",
    );
    await act(async () => {
        hook.result.current.addFocusedSuggestionItem();
    });
    expect(hook.result.current.inputedTags.length).toBe(2);
    expect(hook.result.current.suggestionWindowHook.items.length).toEqual(0);
    expect(inputBox.value).toBe("");

    await userEvent.type(inputBox, "h");
    expect(inputBox.value).toBe("h");
    expect(hook.result.current.suggestionWindowHook.items.length).toEqual(0);

    await act(async () => hook.result.current.suggestionWindowHook.close());
    // 関数の仕様が変わるかも
    inputBox.value = "";
    await act(async () => hook.result.current.popInputedTag());
    expect(hook.result.current.inputedTags.length).toBe(1);

    await act(async () => hook.result.current.popInputedTag());
    expect(hook.result.current.inputedTags.length).toBe(0);
});
