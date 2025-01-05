import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen  } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));

vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(async (cmd: string) => {
        if (cmd === "get_config") {
            return DEFAULT_CONFIG;
        }
        if (cmd === "fetch_website_content") {
            return {
                title: "a",
                desc: "b",
            };
        }
    }),
}));

vi.mock("@tauri-apps/plugin-clipboard-manager",() => ({
    readText: vi.fn(() => {
        return "foo://hello_world"
    })
}))

describe("autoInputUrl", () => {
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
        await user.keyboard("{Control>}A{/Control}");

        const urlInputBox: HTMLInputElement = screen.getByPlaceholderText("url");
        const titleInputBox: HTMLInputElement = screen.getByPlaceholderText("title");
        const descInputBox: HTMLInputElement = screen.getByPlaceholderText("desc");
        expect(urlInputBox.value).toBe("foo://hello_world")
        expect(titleInputBox.value).toBe("a")
        expect(descInputBox.value).toBe("b")
    });
});
