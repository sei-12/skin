import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
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

describe("App.TagListPage", () => {
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

        const menubutton = screen.getByTestId("search-bookmark-menu-button");
        await user.click(menubutton);

        const goTagListButton = screen.getByText("Tag list");
        await user.click(goTagListButton);

        const backButton = screen.getByText("back");
        expect(backButton).toBeInTheDocument();

        await user.click(backButton);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();

        await user.click(screen.getByTestId("search-bookmark-menu-button"));
        await user.click(screen.getByText("Tag list"));

        const item = screen.getByTestId(`tag-item-0-typescript`);

        const textBox = within(item).getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        await user.type(textBox, "hello");
        const buttons = within(item).getAllByRole("button");
        const editButton = buttons[0];

        expect(buttons.length).toBe(1);
        expect(editButton).toBeInTheDocument();

        await user.click(editButton);

        expect(DB.editTag).toBeCalledTimes(1);
        expect(DB.editTag).toBeCalledWith(0, "typescripthello");
    });
});
