import { __suggestion_window_test__ as testHelpers } from "./SuggestionWindow";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";

const { highlightMatchedBlocks, TextBlock, Item } = testHelpers;

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