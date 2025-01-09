import { SuggestionWindow, SuggestionWindowItem, SuggestionWindowItemTextBlock, } from "./SuggestionWindow";
import { render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import { useRef } from "react";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { highlightMatchedBlocks } from "../hooks/SuggestionWindow";


describe("SuggestionWindow", () => {
    test("items", () => {
        const items = ["hello"];
        const predicate = "h";
        const focusIndex = 0;
        const colorTheme = DEFAULT_CONFIG.colorTheme;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        const { container } = render(
            <SuggestionWindow
                items={items}
                predicate={predicate}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
                colorTheme={colorTheme}
            ></SuggestionWindow>
        );

        expect(container).matchSnapshot();

        const matchBlock = screen.getByText("h");
        expect(matchBlock).toBeInTheDocument();
        expect(matchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.match + ";"
        );
        expect(matchBlock).toMatchSnapshot();

        const unmatchBlock = screen.getByText("ello");
        expect(unmatchBlock).toBeInTheDocument();
        expect(unmatchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.unmatch + ";"
        );
        expect(unmatchBlock).toMatchSnapshot();
    });

});

describe("TextBlock", () => {
    test("renders with correct styles for matched text", () => {
        render(<SuggestionWindowItemTextBlock isMatch={true} text="Match" colorTheme={DEFAULT_CONFIG.colorTheme} />);
        const textElement = screen.getByText("Match");
        expect(textElement).toBeInTheDocument();
    });

    test("renders with correct styles for unmatched text", () => {
        render(<SuggestionWindowItemTextBlock isMatch={false} text="Unmatch" colorTheme={DEFAULT_CONFIG.colorTheme} />);
        const textElement = screen.getByText("Unmatch");
        expect(textElement).toBeInTheDocument();
    });
});

describe("Item", () => {
    test("renders item with highlighted blocks", () => {
        const predicate = "abc";
        const item = "aabbcc";
        render(
            <SuggestionWindowItem predicate={predicate} item={item} focus={false} ref={null} colorTheme={DEFAULT_CONFIG.colorTheme} />
        );

        // Verify blocks rendered correctly
        expect(screen.getAllByText("a")[0]).toBeInTheDocument();
        expect(screen.getAllByText("a")[1]).toBeInTheDocument();
        expect(screen.getAllByText("b")[0]).toBeInTheDocument();
        expect(screen.getAllByText("b")[1]).toBeInTheDocument();
        expect(screen.getAllByText("c")[0]).toBeInTheDocument();
        expect(screen.getAllByText("c")[1]).toBeInTheDocument();
    });
});



describe("highlightMatchedBlocks", () => {
    test("完全一致の場合", () => {
        const result = highlightMatchedBlocks("abc", "abc");
        expect(result).toEqual([
            { isMatch: true, text: "abc" }
        ]);
    });

    test("部分一致の場合", () => {
        const result = highlightMatchedBlocks("abc", "aXbYc");
        expect(result).toEqual([
            { isMatch: true, text: "a" },
            { isMatch: false, text: "X" },
            { isMatch: true, text: "b" },
            { isMatch: false, text: "Y" },
            { isMatch: true, text: "c" }
        ]);
    });

    test("大文字小文字を区別しない", () => {
        const result = highlightMatchedBlocks("abc", "aBc");
        expect(result).toEqual([
            { isMatch: true, text: "aBc" }
        ]);
    });

    test("一致する文字がない場合", () => {
        const result = highlightMatchedBlocks("abc", "xyz");
        expect(result).toEqual([
            { isMatch: false, text: "xyz" }
        ]);
    });

    test("predicateが空の場合", () => {
        const result = highlightMatchedBlocks("", "abc");
        expect(result).toEqual([
            { isMatch: false, text: "abc" }
        ]);
    });

    test("itemが空の場合", () => {
        const result = highlightMatchedBlocks("abc", "");
        expect(result).toEqual([]);
    });

    test("両方が空の場合", () => {
        const result = highlightMatchedBlocks("", "");
        expect(result).toEqual([]);
    });

    test("長いpredicateと短いitem", () => {
        const result = highlightMatchedBlocks("abcdef", "abc");
        expect(result).toEqual([
            { isMatch: true, text: "abc" }
        ]);
    });

    test("短いpredicateと長いitem", () => {
        const result = highlightMatchedBlocks("abc", "abcdef");
        expect(result).toEqual([
            { isMatch: true, text: "abc" },
            { isMatch: false, text: "def" }
        ]);
    });
});
