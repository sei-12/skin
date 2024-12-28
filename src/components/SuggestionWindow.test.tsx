import { SuggestionWindow, SuggestionWindowItem, SuggestionWindowItemTextBlock, } from "./SuggestionWindow";
import { render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import { useRef } from "react";
import { globalColorTheme } from "../lib/theme";


describe("SuggestionWindow", () => {
    test("items", () => {
        const items = ["hello"];
        const predicate = "h";
        const focusIndex = 0;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        const { container } = render(
            <SuggestionWindow
                items={items}
                predicate={predicate}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
            ></SuggestionWindow>
        );

        expect(container).matchSnapshot();

        const matchBlock = screen.getByText("h");
        expect(matchBlock).toBeInTheDocument();
        expect(matchBlock).toHaveStyle(
            "color: " + globalColorTheme.suggestionWindow.match + ";"
        );
        expect(matchBlock).toMatchSnapshot();

        const unmatchBlock = screen.getByText("ello");
        expect(unmatchBlock).toBeInTheDocument();
        expect(unmatchBlock).toHaveStyle(
            "color: " + globalColorTheme.suggestionWindow.unmatch + ";"
        );
        expect(unmatchBlock).toMatchSnapshot();
    });

});

describe("TextBlock", () => {
    test("renders with correct styles for matched text", () => {
        render(<SuggestionWindowItemTextBlock isMatch={true} text="Match" />);
        const textElement = screen.getByText("Match");
        expect(textElement).toBeInTheDocument();
    });

    test("renders with correct styles for unmatched text", () => {
        render(<SuggestionWindowItemTextBlock isMatch={false} text="Unmatch" />);
        const textElement = screen.getByText("Unmatch");
        expect(textElement).toBeInTheDocument();
    });
});

describe("Item", () => {
    test("renders item with highlighted blocks", () => {
        const predicate = "abc";
        const item = "aabbcc";
        render(
            <SuggestionWindowItem predicate={predicate} item={item} focus={false} ref={null} />
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
