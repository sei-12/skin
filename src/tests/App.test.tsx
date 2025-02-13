import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { WindowVisibleController } from "../services/windowVisibleController";
import { startMockDB } from "../services/database.test";
import { DB } from "../services/database";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/mockClipboard.test";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(async (cmd: string) => {
        if (cmd === "get_config") {
            return DEFAULT_CONFIG;
        }
        if (cmd === "fetch_website_content") {
            return {
                title: "",
                desc: "",
            };
        }
    }),
}));

vi.mock("@tauri-apps/plugin-clipboard-manager", () => ({
    readText: vi.fn(() => {
        return "";
    }),
}));

describe("App.SearchBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        startMockClipboardManager("");

        await act(async () => {
            render(<App></App>);
        });
    });

    test("test1", async () => {
        const user = userEvent.setup();
        expect(screen.getByPlaceholderText("/")).not.toHaveFocus();
        await user.keyboard("/");
        const predicateInputBox = screen.getByTestId(
            "taginputbox-predicateinputbox"
        );
        expect(predicateInputBox).toBeInTheDocument();
        expect(screen.getByPlaceholderText("/")).toHaveFocus();
    });

    test("test2", async () => {
        const user = userEvent.setup();
        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(1);
    });

    test("test3", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);

        // TestingLibraryElementError
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20)

        await user.type(inputBox, "y");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(1);
        expect(DB.fuzzyFindTag).toBeCalledTimes(2);

        await user.type(inputBox, "{Enter}");

        expect(DB.findBookmark).toBeCalledTimes(1);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(4);
        expect(screen.getAllByText("typescript").length).toBe(1);
        expect(screen.getAllByText("#typescript").length).toBe(4);
        expect(screen.getByText("hello8")).toBeInTheDocument();
        expect(screen.getByText("hello12")).toBeInTheDocument();
        expect(screen.getByText("hello14")).toBeInTheDocument();
        expect(screen.getByText("hello18")).toBeInTheDocument();

        await user.type(inputBox, "{Backspace}");
        expect(DB.fetchBookmarks).toBeCalledTimes(2);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20)
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();
    });

    test("test4", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        await user.type(inputBox, "tya");
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20)
        expect(() => screen.getAllByTestId("suggestion-item")).toThrow();
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();

        expect(DB.fuzzyFindTag).toBeCalledTimes(3); // タイプ数
        expect(DB.deleteBookmark).toBeCalledTimes(0);
        expect(DB.fetchBookmarks).toBeCalledTimes(1); //一番初めに一度呼ばれる
        expect(DB.insertBookmark).toBeCalledTimes(0);
        expect(DB.isExistsTag).toBeCalledTimes(0);
    });

    test("test5", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = function () {};

        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);

        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(DB.findBookmark).toBeCalledTimes(1);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(3);
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("javascript").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}P{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("gist").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
    });

    test("test6 Backspace時に1個ずつタグを削除していく", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test7 Backspace時に1個ずつタグを削除していく(2)", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "t");
        expect(DB.fuzzyFindTag).toBeCalledTimes(4);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);

        await user.type(inputBox, "a");
        expect(DB.fuzzyFindTag).toBeCalledTimes(5);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(5);

        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test8 Backspace時に1個ずつタグを削除していく(3)", async () => {
        // type(inputBox) -> keyboard()
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.fuzzyFindTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "t");
        expect(DB.fuzzyFindTag).toBeCalledTimes(4);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);

        await user.type(inputBox, "a");
        expect(DB.fuzzyFindTag).toBeCalledTimes(5);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(5);

        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.keyboard("{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test9", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);

        await user.keyboard("{ArrowDown}");
        await user.type(inputBox, "{Enter}");
        expect(DB.findBookmark).toBeCalledTimes(1);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(3);
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{ArrowDown}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("javascript").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{ArrowUp}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("gist").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(15);
    });

    test("test10 AddButton", async () => {
        const user = userEvent.setup();
        const menubutton = screen.getByTestId(
            "search-bookmark-menu-button"
        );
        await user.click(menubutton);
        const addButton = screen.getByText("Create new Bookmark");

        await user.click(addButton);
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();
    });

    test("test11 AddButton2", async () => {
        const user = userEvent.setup();

        const toCreate = async () => {
            const menubutton = screen.getByTestId(
                "search-bookmark-menu-button"
            );
            await user.click(menubutton);
            const addButton = screen.getByText("Create new Bookmark");
    
            await user.click(addButton);
            expect(
                screen.getByTestId("create-new-bookmark")
            ).toBeInTheDocument();
        };
        const toSearch = async () => {
            const cancelButton = screen.getByText("Cancel");
            await user.click(screen.getByPlaceholderText("/"));
            expect(cancelButton).toBeInTheDocument();
            await user.click(cancelButton);
            expect(WindowVisibleController.hide).toBeCalledTimes(0);
            expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
        };

        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
    });

});
