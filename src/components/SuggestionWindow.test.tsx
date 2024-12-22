import { SuggestionWindow, __suggestion_window_test__ as testHelpers, useSuggestionWindow } from "./SuggestionWindow";
import { act, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import { useRef } from "react";
import { globalColorTheme } from "../lib/theme";

const { highlightMatchedBlocks, TextBlock, Item } = testHelpers;

describe("SuggestionWindow",() => {
    test("items",() => {
        const items = ["hello"]
        const predicate = "h"
        const focusIndex = 0
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement|null)[]>([])
        })

        const {container} = render(
            <SuggestionWindow
               items={items}
               predicate={predicate}
               focusIndex={focusIndex}
               itemRefs={refs.result.current}>
            </SuggestionWindow>
        )
        
        
        expect(container).matchSnapshot()


        let matchBlock = screen.getByText("h")
        expect(matchBlock).toBeInTheDocument()
        expect(matchBlock).toHaveStyle("color: " + globalColorTheme.suggestionWindow.match + ";")
        expect(matchBlock).toMatchSnapshot()

        let unmatchBlock = screen.getByText("ello")
        expect(unmatchBlock).toBeInTheDocument()
        expect(unmatchBlock).toHaveStyle("color: " + globalColorTheme.suggestionWindow.unmatch + ";")
        expect(unmatchBlock).toMatchSnapshot()
    })
    
    test("useSuggestionWindow",() => {
        const hook = renderHook(() => {
            return useSuggestionWindow(async () => [],() => [])
        })
        let r = render(<SuggestionWindow {...hook.result.current.props}></SuggestionWindow>)

        expect(r.container).matchSnapshot()

        act(() => {
            hook.result.current.setItems([
                "hello",
                "haaaaa",
                "aaahh",
                "bbbha"
            ])
            hook.result.current.setPredicate("h")
        })
    })
    

    test("getFocusedItem",() => {
        const hook = renderHook(() => {
            return useSuggestionWindow(async () => [],() => [])
        })

        expect(hook.result.current.getFocusedItem()).toBe(undefined)
        
        act(() => {
            hook.result.current.setFocusIndex(1)
            hook.result.current.setItems([
                "hello",
                "aaa"
            ])
        })
        
        expect(hook.result.current.getFocusedItem()).toBe("aaa")

        act(() => {
            hook.result.current.setFocusIndex(2)
            hook.result.current.setItems([
                "hello",
                "aaa",
                "hey",
                "foo",
            ])
        })

        expect(hook.result.current.getFocusedItem()).toBe("hey")

        act(() => {
            hook.result.current.setItems([])
        })

        expect(hook.result.current.getFocusedItem()).toBe(undefined)
    })
})

describe("highlightMatchedBlocks", () => {
    test("returns correctly highlighted blocks when all characters match in order", () => {
        const result = highlightMatchedBlocks("abc", "aabbcc");
        expect(result).toEqual([
            { isMatch: true, text: "a" },
            { isMatch: false, text: "a" },
            { isMatch: true, text: "b" },
            { isMatch: false, text: "b" },
            { isMatch: true, text: "c" },
            { isMatch: false, text: "c" }
        ]);
    });

    test("returns correctly highlighted blocks with partial matches", () => {
        const result = highlightMatchedBlocks("abc", "acbac");
        expect(result).toEqual([
            { isMatch: true, text: "a" },
            { isMatch: false, text: "c" },
            { isMatch: true, text: "b" },
            { isMatch: false, text: "a" },
            { isMatch: true, text: "c" }
        ]);
    });

    test("returns no matches when predicate is empty", () => {
        const result = highlightMatchedBlocks("", "abcdef");
        expect(result).toEqual([
            { isMatch: false, text: "abcdef" }
        ]);
    });

    test("handles empty item gracefully", () => {
        const result = highlightMatchedBlocks("abc", "");
        expect(result).toEqual([]);
    });
});

describe("TextBlock", () => {
    test("renders with correct styles for matched text", () => {
        render(<TextBlock isMatch={true} text="Match" />);
        const textElement = screen.getByText("Match");
        expect(textElement).toBeInTheDocument();
    });

    test("renders with correct styles for unmatched text", () => {
        render(<TextBlock isMatch={false} text="Unmatch" />);
        const textElement = screen.getByText("Unmatch");
        expect(textElement).toBeInTheDocument();
    });
});

describe("Item", () => {
    test("renders item with highlighted blocks", () => {
        const predicate = "abc";
        const item = "aabbcc";
        render(<Item predicate={predicate} item={item} focus={false} ref={null} />);

        // Verify blocks rendered correctly
        expect(screen.getAllByText("a")[0]).toBeInTheDocument()
        expect(screen.getAllByText("a")[1]).toBeInTheDocument()
        expect(screen.getAllByText("b")[0]).toBeInTheDocument()
        expect(screen.getAllByText("b")[1]).toBeInTheDocument()
        expect(screen.getAllByText("c")[0]).toBeInTheDocument()
        expect(screen.getAllByText("c")[1]).toBeInTheDocument()
    });
});