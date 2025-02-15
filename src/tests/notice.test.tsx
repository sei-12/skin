import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";

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

describe("Notice", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();

        await act(async () => {
            render(<App></App>);
        });
    });

    test("test1", async () => {
        const user = userEvent.setup();

        expect(() => screen.getByText("SUCCESS!")).toThrow();

        await userEvent.keyboard("{Control>}A{/Control}");

        expect(() => screen.getByText("SUCCESS!")).toThrow();

        await user.keyboard("{Escape}");
        expect(() => screen.getByText("SUCCESS!")).toThrow();

        const openMenuButton = screen.getAllByTestId("open-bookmark-button")[0];
        await user.click(openMenuButton);
        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Delete"));

        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();
    });

    test("test2", async () => {
        const user = userEvent.setup();

        await userEvent.keyboard("{Control>}A{/Control}");
        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(screen.getByText("ERROR!")).toBeInTheDocument();

        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox = screen.getByPlaceholderText("/");

        await user.type(titleInputBox, "title");
        await user.type(urlInputBox, "url");
        await user.type(predicateInputBox, "t{Enter}");
        await user.type(predicateInputBox, "t{Enter}");
        await user.type(urlInputBox, "a");
        await user.type(descInputBox, "desc");
        await user.type(titleInputBox, "a");

        await user.click(screen.getByText("Done"));

        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();
    });

    test("test3", async () => {
        const user = userEvent.setup();
        const openMenuButton = screen.getAllByTestId("open-bookmark-button")[0];
        await user.click(openMenuButton);

        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Edit"));

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("test4", async () => {
        const user = userEvent.setup();

        const openMenuButton = screen.getAllByTestId("open-bookmark-button")[0];
        await user.click(openMenuButton);

        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Edit"));

        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        const predicateInputBox = screen.getByPlaceholderText("/");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");
        await user.type(predicateInputBox, "{Backspace}");

        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();
        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(screen.getByText("ERROR!")).toBeInTheDocument();

        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();
    });
});
