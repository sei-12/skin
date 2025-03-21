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

describe("App.SearchBookmark4", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        startMockClipboardManager("");

        await act(async () => {
            render(<App></App>);
        });
    });

    test("一度閉じてから開いた時に、フォーカスしているアイテムが見えない", async () => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        const user = userEvent.setup();

        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);

        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Escape}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(5);
    });

    test("ウィンドウを閉じた時に検索ボックスをクリア", async () => {
        const user = userEvent.setup();
        await user.keyboard("/");
        await user.keyboard("hello-world");
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();
        const inputBox: HTMLInputElement = screen.getByPlaceholderText("/");
        expect(inputBox.value).toBe("hello-world");
        await user.keyboard("{Escape}");
        expect(inputBox.value).toBe("");
    });

    test("クリックでタグを追加", async () => {
        const user = userEvent.setup();
        await user.keyboard("/");
        await user.keyboard("java");
        await user.click(screen.getByText("javascript"));
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();
    });

    test("ショートカットキーで編集画面に遷移", async () => {
        const user = userEvent.setup();
        await user.keyboard("{Control>}{Shift>}E{/Shift}{/Control}");
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();
        await user.keyboard("/helloworld-aaaaaaaaaaa ");
        await user.keyboard("{Control>}{Enter}{/Control}");
        expect(DB.editBookmark).toBeCalledTimes(1);
        expect(DB.editBookmark).toBeCalledWith(0, "hello0", "url", "d", [
            "less",
            "cpp",
            "rust",
            "javascript",
            "helloworld-aaaaaaaaaaa",
        ]);
    });
});
