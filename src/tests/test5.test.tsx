import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { DB } from "../services/database";
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

describe("App.CreateNewBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();

        await act(async () => {
            render(<App></App>);
        });

        await userEvent.keyboard("{Control>}A{/Control}");
    });

    // 原因がわからないエラーが時々発生するので分離
    test("test5", async () => {
        const user = userEvent.setup();

        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox = screen.getByPlaceholderText("/");

        expect(urlInputBox).toBeInTheDocument();
        expect(titleInputBox).toBeInTheDocument();
        expect(descInputBox).toBeInTheDocument();
        expect(predicateInputBox).toBeInTheDocument();

        await user.click(predicateInputBox);
        await user.type(predicateInputBox, "t");
        await user.type(predicateInputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(titleInputBox, "hello");
        await user.type(descInputBox, "description");
        await user.type(urlInputBox, "url://hello");

        const doneButton = screen.getByText("Done");
        expect(doneButton).toBeInTheDocument();
        await user.click(doneButton);

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript"],
        );

        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });
});
