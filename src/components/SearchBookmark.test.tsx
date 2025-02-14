import { describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { SearchBookmark, type SearchBookmarkProps } from "./SearchBookmark";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { useRef } from "react";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function buildProps(): SearchBookmarkProps {
    const inputBoxRef = renderHook(() => useRef<HTMLInputElement>(null));
    const itemRefs = renderHook(() => useRef<(HTMLDivElement | null)[]>([]));
    const bkmklist_itemRefs = renderHook(() =>
        useRef<(HTMLDivElement | null)[]>([])
    );

    return {
        onClickAdd: vi.fn(),
        onClickGoTagList: vi.fn(),
        colorTheme: DEFAULT_CONFIG.colorTheme,
        tagInputBoxProps: {
            inputBoxRef: inputBoxRef.result.current,
            colorTheme: DEFAULT_CONFIG.colorTheme,
            inputedTags: [],
            onChangePredicateInputBox: vi.fn(),
            swProps: {
                colorTheme: DEFAULT_CONFIG.colorTheme,
                focusIndex: 0,
                items: [],
                itemRefs: itemRefs.result.current,
            },
        },

        bkmkListProps: {
            colorTheme: DEFAULT_CONFIG.colorTheme,
            focusIndex: 0,
            items: [],
            onClickEdit: vi.fn(),
            itemRefs: bkmklist_itemRefs.result.current,
            onClickRemove: vi.fn(),
        },
    };
}

describe("SearchBookmark", () => {
    test("case1", async () => {
        const props = buildProps();
        const user = userEvent.setup();
        render(<SearchBookmark {...props}></SearchBookmark>);

        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        await user.click(menubutton);
        const addButton = screen.getByText("Create new Bookmark");

        expect(props.onClickAdd).toBeCalledTimes(0);
        await user.click(addButton);
        expect(props.onClickAdd).toBeCalledTimes(1);
        await user.click(addButton);
        expect(props.onClickAdd).toBeCalledTimes(2);
    });

    test("case2", async () => {
        const props = buildProps();
        render(<SearchBookmark {...props}></SearchBookmark>);

        const predicateInputBox = screen.getByPlaceholderText("/");
        const user = userEvent.setup();

        await user.type(predicateInputBox, "t");
        expect(
            props.tagInputBoxProps.onChangePredicateInputBox
        ).toBeCalledTimes(1);
        expect(props.tagInputBoxProps.onChangePredicateInputBox).toBeCalledWith(
            "t"
        );

        await user.type(predicateInputBox, "t");
        expect(
            props.tagInputBoxProps.onChangePredicateInputBox
        ).toBeCalledTimes(2);
        expect(props.tagInputBoxProps.onChangePredicateInputBox).toBeCalledWith(
            "tt"
        );

        await user.type(predicateInputBox, "{Backspace}");
        expect(
            props.tagInputBoxProps.onChangePredicateInputBox
        ).toBeCalledTimes(3);
        expect(props.tagInputBoxProps.onChangePredicateInputBox).toBeCalledWith(
            "t"
        );

        await user.type(predicateInputBox, "{Backspace}");
        expect(
            props.tagInputBoxProps.onChangePredicateInputBox
        ).toBeCalledTimes(4);
        expect(props.tagInputBoxProps.onChangePredicateInputBox).toBeCalledWith(
            ""
        );
    });

    test("case3", async () => {
        const props = buildProps();
        render(<SearchBookmark {...props}></SearchBookmark>);

        const predicateInputBox = screen.getByPlaceholderText("/");
        const user = userEvent.setup();

        const typeScring = "helloworld@d_.:-¥-@:s:13:";
        await user.type(predicateInputBox, typeScring);
        expect(
            props.tagInputBoxProps.onChangePredicateInputBox
        ).toBeCalledTimes(typeScring.length);
        expect(props.tagInputBoxProps.onChangePredicateInputBox).toBeCalledWith(
            typeScring
        );
    });
    
    test("case4 onClickGoTagList", async () => {
        const props = buildProps();
        const user = userEvent.setup();
        render(<SearchBookmark {...props}></SearchBookmark>);

        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        await user.click(menubutton);
        const goTagList = screen.getByText("Tag list");

        expect(props.onClickGoTagList).toBeCalledTimes(0);
        await user.click(goTagList);
        expect(props.onClickGoTagList).toBeCalledTimes(1);
        await user.click(goTagList);
        expect(props.onClickGoTagList).toBeCalledTimes(2);
    });

    
    test("case5 menuを閉じる", async () => {
        const props = buildProps();
        const user = userEvent.setup();
        render(<SearchBookmark {...props}></SearchBookmark>);

        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        await user.click(menubutton);

        const goTagList = screen.getByText("Tag list");
        expect(goTagList).toBeVisible()

        await user.click(menubutton);
        expect(() => screen.getByDisplayValue("Tag list")).toThrow()
    });

});
