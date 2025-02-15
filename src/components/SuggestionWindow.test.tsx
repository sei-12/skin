import {
    SuggestionWindow,
    SuggestionWindowItem,
    SuggestionWindowItemTextBlock,
} from "./SuggestionWindow";
import { render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test, vi } from "vitest";
import { useRef } from "react";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import userEvent from "@testing-library/user-event";

describe("SuggestionWindow", () => {
    test("items", () => {
        const items: [string, boolean][][] = [
            [
                ["h", true],
                ["ello", false],
            ],
        ];
        const focusIndex = 0;
        const colorTheme = DEFAULT_CONFIG.colorTheme;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        const { container } = render(
            <SuggestionWindow
                items={items}
                onClickItem={vi.fn()}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
                colorTheme={colorTheme}
            ></SuggestionWindow>,
        );

        expect(container).matchSnapshot();

        const matchBlock = screen.getByText("h");
        expect(matchBlock).toBeInTheDocument();
        expect(matchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.match + ";",
        );
        expect(matchBlock).toMatchSnapshot();

        const unmatchBlock = screen.getByText("ello");
        expect(unmatchBlock).toBeInTheDocument();
        expect(unmatchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.unmatch + ";",
        );
        expect(unmatchBlock).toMatchSnapshot();
    });

    test("test2", () => {
        const items: [string, boolean][][] = [[["helloworld", true]]];
        const focusIndex = 0;
        const colorTheme = DEFAULT_CONFIG.colorTheme;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        render(
            <SuggestionWindow
                items={items}
                onClickItem={vi.fn()}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
                colorTheme={colorTheme}
            ></SuggestionWindow>,
        );

        const matchBlock = screen.getByText("helloworld");
        expect(matchBlock).toBeInTheDocument();
        expect(matchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.match + ";",
        );
    });

    test("test3", () => {
        const items: [string, boolean][][] = [[["helloworld", false]]];
        const focusIndex = 0;
        const colorTheme = DEFAULT_CONFIG.colorTheme;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        render(
            <SuggestionWindow
                items={items}
                onClickItem={vi.fn()}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
                colorTheme={colorTheme}
            ></SuggestionWindow>,
        );

        const unmatchBlock = screen.getByText("helloworld");
        expect(unmatchBlock).toBeInTheDocument();
        expect(unmatchBlock).toHaveStyle(
            "color: " + colorTheme.suggestionWindow.unmatch + ";",
        );
        expect(unmatchBlock).toMatchSnapshot();
    });

    test("test3", async () => {
        const items: [string, boolean][][] = [
            [["helloworld", true]],
            [["hello", true]],
            [["aaaaa", true]],
        ];

        const focusIndex = 0;
        const colorTheme = DEFAULT_CONFIG.colorTheme;
        const refs = renderHook(() => {
            return useRef<(HTMLDivElement | null)[]>([]);
        });

        const onClickItem = vi.fn();
        render(
            <SuggestionWindow
                items={items}
                onClickItem={onClickItem}
                focusIndex={focusIndex}
                itemRefs={refs.result.current}
                colorTheme={colorTheme}
            ></SuggestionWindow>,
        );

        const user = userEvent.setup();

        await user.click(screen.getByText("helloworld"));
        expect(onClickItem).toBeCalledTimes(1);
        expect(onClickItem).toBeCalledWith(0);

        await user.click(screen.getByText("hello"));
        expect(onClickItem).toBeCalledTimes(2);
        expect(onClickItem).toBeCalledWith(1);

        await user.click(screen.getByText("aaaaa"));
        expect(onClickItem).toBeCalledTimes(3);
        expect(onClickItem).toBeCalledWith(2);

        await user.click(screen.getByText("helloworld"));
        expect(onClickItem).toBeCalledTimes(4);
        expect(onClickItem).toBeCalledWith(0);
    });
});

describe("TextBlock", () => {
    test("renders with correct styles for matched text", () => {
        render(
            <SuggestionWindowItemTextBlock
                isMatch={true}
                text="Match"
                colorTheme={DEFAULT_CONFIG.colorTheme}
            />,
        );
        const textElement = screen.getByText("Match");
        expect(textElement).toBeInTheDocument();
    });

    test("renders with correct styles for unmatched text", () => {
        render(
            <SuggestionWindowItemTextBlock
                isMatch={false}
                text="Unmatch"
                colorTheme={DEFAULT_CONFIG.colorTheme}
            />,
        );
        const textElement = screen.getByText("Unmatch");
        expect(textElement).toBeInTheDocument();
    });
});

describe("Item", () => {
    test("renders item with highlighted blocks", () => {
        const item: [string, boolean][] = [
            ["a", true],
            ["a", false],
            ["b", true],
            ["b", false],
            ["c", true],
            ["c", false],
        ];
        render(
            <SuggestionWindowItem
                item={item}
                focus={false}
                onClick={() => {}}
                ref={null}
                colorTheme={DEFAULT_CONFIG.colorTheme}
            />,
        );

        expect(screen.getAllByText("a")[0]).toBeInTheDocument();
        expect(screen.getAllByText("a")[1]).toBeInTheDocument();
        expect(screen.getAllByText("b")[0]).toBeInTheDocument();
        expect(screen.getAllByText("b")[1]).toBeInTheDocument();
        expect(screen.getAllByText("c")[0]).toBeInTheDocument();
        expect(screen.getAllByText("c")[1]).toBeInTheDocument();
    });

    test("test click", async () => {
        const user = userEvent.setup();
        const item: [string, boolean][] = [
            ["a", true],
            ["a", false],
            ["b", true],
            ["b", false],
            ["c", true],
            ["c", false],
        ];

        const onClick = vi.fn();
        render(
            <SuggestionWindowItem
                item={item}
                focus={false}
                onClick={onClick}
                ref={null}
                colorTheme={DEFAULT_CONFIG.colorTheme}
            />,
        );

        expect(onClick).toBeCalledTimes(0);
        const a = screen.getByTestId("suggestion-item");
        await user.click(a);
        expect(onClick).toBeCalledTimes(1);
    });
});
