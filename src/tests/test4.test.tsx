
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/mockClipboard.test";
import userEvent from "@testing-library/user-event";

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

    test("一度閉じてから開いた時に、フォーカスしているアイテムが見えない",async () => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        const user = userEvent.setup();

        expect(screen.getAllByTestId("bkmkitem").length).toBe(20);

        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Escape}")
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(5)
    })
});