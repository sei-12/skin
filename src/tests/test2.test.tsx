import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/mockClipboard.test";
import userEvent from "@testing-library/user-event";
import { DB } from "../services/database";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));

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

describe("App.SearchBookmark2", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        startMockClipboardManager("");

        await act(async () => {
            render(<App></App>);
        });
    });

    test("MenuButton", async () => {
        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        expect(menubutton).toBeInTheDocument();
        expect(menubutton).toHaveStyle(
            "background-color: " + DEFAULT_CONFIG.colorTheme.addButton.bgColor,
        );
        expect(menubutton).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.addButton.color,
        );
        expect(menubutton).toHaveStyle(
            "border-color: " + DEFAULT_CONFIG.colorTheme.addButton.borderColor,
        );
    });

    test("検索タグが0の時に全てのブックマークを表示", async () => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        {
            expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
            const user = userEvent.setup();
            const menubutton = screen.getByTestId(
                "search-bookmark-menu-button",
            );
            await user.click(menubutton);
            const addButton = screen.getByText("Create new Bookmark");
            await user.click(addButton);
            await user.keyboard("{Escape}");
            await user.click(screen.getByText("ページを離れる"));
        }
        {
            expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
            const user = userEvent.setup();
            const menubutton = screen.getByTestId(
                "search-bookmark-menu-button",
            );
            await user.click(menubutton);
            const addButton = screen.getByText("Create new Bookmark");
            await user.click(addButton);
            await user.keyboard("{Escape}");
            await user.click(screen.getByText("ページを離れる"));
        }
        {
            expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
            const user = userEvent.setup();
            const menubutton = screen.getByTestId(
                "search-bookmark-menu-button",
            );
            await user.click(menubutton);
            const addButton = screen.getByText("Create new Bookmark");

            await user.click(addButton);
            await user.keyboard("{Escape}");
            await user.click(screen.getByText("ページを離れる"));
        }
        {
            expect(screen.getAllByTestId("bkmkitem").length).toBe(20);
            const user = userEvent.setup();
            const menubutton = screen.getByTestId(
                "search-bookmark-menu-button",
            );
            await user.click(menubutton);
            const addButton = screen.getByText("Create new Bookmark");
            await user.click(addButton);
            await user.keyboard("{Escape}");
            await user.click(screen.getByText("ページを離れる"));
        }
    });

    test("ショートカットキーで項目を削除", async () => {
        window.HTMLElement.prototype.scrollIntoView = function () {};
        const user = userEvent.setup();
        const focus_down_and_delete = async (id: number) => {
            vi.clearAllMocks();
            startMockDB();
            for (let i = 0; i < id; i++) {
                await user.keyboard("{Control>}N{/Control}");
            }
            await user.keyboard("{Control>}{Shift>}D{/Shift}{/Control}");
            expect(DB.deleteBookmark).toBeCalledTimes(1);
            expect(DB.deleteBookmark).toBeCalledWith(id);
        };

        for (let i = 0; i < 8; i++) {
            await focus_down_and_delete(i);
        }
    });

    test("AddButtonをダブルクリック", async () => {
        window.HTMLElement.prototype.scrollIntoView = function () {};
        const user = userEvent.setup();
        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        await user.click(menubutton);
        const addButton = screen.getByText("Create new Bookmark");
        await user.dblClick(addButton);

        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();
    });
});
