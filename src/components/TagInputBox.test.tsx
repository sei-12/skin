import { describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TagInputBoxProps } from "./TagInputBox";
import { TagInputBox } from "./TagInputBox";
import { useRef } from "react";
import type { SuggestionWindowProps } from "./SuggestionWindow";

function bulidSwProps(): SuggestionWindowProps {
    return {
        colorTheme: DEFAULT_CONFIG.colorTheme,
        focusIndex: 0,
        predicate: "",
        items: [],
        itemRefs: renderHook(() => useRef<(HTMLDivElement | null)[]>([])).result
            .current,
    };
}

function buildProps(
    inputedTags: {
        text: string;
        exists: boolean;
    }[],
    swProps: SuggestionWindowProps
): TagInputBoxProps {
    return {
        colorTheme: DEFAULT_CONFIG.colorTheme,
        onChangePredicateInputBox: vi.fn(),
        inputBoxRef: renderHook(() => useRef<HTMLInputElement>(null)).result
            .current,
        inputedTags,
        swProps,
    };
}

describe("TagInputBox", () => {
    test("test1", async () => {
        const user = userEvent.setup();
        const swProps = bulidSwProps();
        const props = buildProps([], swProps);

        render(<TagInputBox {...props}></TagInputBox>);

        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");
        await user.type(predicateInputBox, "hello");
        expect(props.onChangePredicateInputBox).toBeCalledTimes(5);
        expect(props.onChangePredicateInputBox).toBeCalledWith("hello");
    });

    test("test2", async () => {
        const swProps = bulidSwProps();
        const props = buildProps(
            [
                { text: "hello", exists: true },
                { text: "world", exists: false },
                { text: "abcde", exists: true },
                { text: "aaaaa", exists: false },
                { text: "bbbbb", exists: true },
            ],
            swProps
        );

        render(<TagInputBox {...props}></TagInputBox>);

        const inputedTagElms = screen.getAllByTestId("taginputbox-tagitem");
        expect(inputedTagElms.length).toBe(5);

        const tag1 = screen.getByText("hello");
        expect(tag1).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.tagItem.exists + ";"
        );

        const tag2 = screen.getByText("world");
        expect(tag2).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.tagItem.notExists + ";"
        );

        const tag3 = screen.getByText("abcde");
        expect(tag3).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.tagItem.exists + ";"
        );

        const tag4 = screen.getByText("aaaaa");
        expect(tag4).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.tagItem.notExists + ";"
        );
    });
});
