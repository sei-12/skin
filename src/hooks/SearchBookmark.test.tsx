import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import userEvent from "@testing-library/user-event";
import { HOTKEY_SCOPES } from "./hotkey";
import { SearchBookmarkPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { WindowVisibleController } from "../services/windowVisibleController";
import { startMockDB } from "../services/database.test";
import { DB } from "../services/database";
import { NoticeProvider } from "../providers/NoticeProvider";
import { useNavigate } from "react-router-dom";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

window.HTMLElement.prototype.scrollIntoView = vi.fn();
describe("SearchBookmark", () => {
    let nav = vi.fn();
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.mock("react-router-dom");
        startMockWindowVisibleController();
        startMockDB();
        nav = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(nav);

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <SearchBookmarkPage></SearchBookmarkPage>
                    </NoticeProvider>
                </HotkeysProvider>,
            );
        });
    });

    test("test1", async () => {
        const user = userEvent.setup();
        expect(screen.getByPlaceholderText("/")).not.toHaveFocus();
        await user.keyboard("/");
        const predicateInputBox = screen.getByTestId(
            "taginputbox-predicateinputbox",
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
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);

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
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
        expect(DB.findBookmark).toBeCalledTimes(1);
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();
    });

    test("test4", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        await user.type(inputBox, "tya");
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
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

    test("test6", async () => {
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

    test("検索タグが0の時に全てのブックマークを表示", async () => {
        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
    });

    test("ショートカットキーで項目を削除", async () => {
        const user = userEvent.setup();
        await user.keyboard("{Control>}{Shift>}D{/Shift}{/Control}");
        expect(DB.deleteBookmark).toBeCalledTimes(1);
        expect(DB.deleteBookmark).toBeCalledWith(0);
    });

    test("ショートカットキーで項目を削除2", async () => {
        const user = userEvent.setup();

        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}P{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}P{/Control}");
        await user.keyboard("{Control>}P{/Control}");

        await user.keyboard("{Control>}{Shift>}D{/Shift}{/Control}");

        expect(DB.deleteBookmark).toBeCalledTimes(1);
        expect(DB.deleteBookmark).toBeCalledWith(0);
    });

    test("ショートカットキーで編集画面に遷移", async () => {
        const user = userEvent.setup();

        await user.keyboard("{Control>}{Shift>}E{/Shift}{/Control}");

        expect(nav).toBeCalledTimes(1);
        expect(nav).toBeCalledWith("/edit-bookmark", {
            state: { bookmarkId: 0 },
        });
    });

    test("ショートカットキーで編集画面に遷移2", async () => {
        const user = userEvent.setup();

        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}P{/Control}");

        await user.keyboard("{Control>}{Shift>}E{/Shift}{/Control}");

        expect(nav).toBeCalledTimes(1);
        expect(nav).toBeCalledWith("/edit-bookmark", {
            state: { bookmarkId: 1 },
        });
    });

    test("削除した時に通知1 (ボタンを押す)", async () => {
        const user = userEvent.setup();

        // この時点では表示されていない
        expect(() => {
            screen.getByText("SUCCESS!");
        }).toThrow();

        const openMenuButton = screen.getAllByTestId("open-bookmark-button")[0];
        await user.click(openMenuButton);
        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Delete"));

        // 通知が表示されている
        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();
        expect(DB.deleteBookmark).toBeCalledTimes(1);
    });
    test("削除した時に通知2 (ショートカットキー)", async () => {
        const user = userEvent.setup();

        // この時点では表示されていない
        expect(() => {
            screen.getByText("SUCCESS!");
        }).toThrow();

        await user.keyboard("{Control>}{Shift>}D{/Shift}{/Control}");

        // 通知が表示されている
        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();
        expect(DB.deleteBookmark).toBeCalledTimes(1);
    });

    test("test7 クリックでタグを追加", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = function () {};

        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.fetchBookmarks).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.fuzzyFindTag).toBeCalledTimes(1);

        await user.click(screen.getByText("javascript"));
        expect(screen.getAllByTestId("bkmkitem").length).toBe(3);
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.click(screen.getByText("typescript"));
        expect(screen.getAllByText("typescript").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.click(screen.getByText("python"));
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.click(screen.getByText("python"));
        await user.type(inputBox, "t");
        await user.click(screen.getByText("typescript"));
        await user.type(inputBox, "kotl");
        await user.click(screen.getByText("kotlin"));

        const root = screen.getByTestId("taginputbox-root");
        expect(within(root).getAllByText("typescript").length).toBe(1);
        expect(within(root).getAllByText("python").length).toBe(1);
        expect(within(root).getAllByText("kotlin").length).toBe(1);
    });
});
