import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/mockClipboard.test";

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
    
    test("AddButton",async ( ) => {
        const addButton = screen.getByTestId("add-button");
        expect(addButton).toBeInTheDocument()
        expect(addButton).toHaveStyle("background-color: "+ DEFAULT_CONFIG.colorTheme.addButton.bgColor)
        expect(addButton).toHaveStyle("color: "+ DEFAULT_CONFIG.colorTheme.addButton.color)
        expect(addButton).toHaveStyle("border-color: "+ DEFAULT_CONFIG.colorTheme.addButton.borderColor)
    })
})