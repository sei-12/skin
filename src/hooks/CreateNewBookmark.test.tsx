import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import { CreateNewBookmarkPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/clipboard.test";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn((a) => console.log(a)),
}));
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

describe("CreateNewBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
    });

    test("test1", async () => {
        startMockClipboardManager("https://hello_world")

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <CreateNewBookmarkPage></CreateNewBookmarkPage>
                </HotkeysProvider>
            );
        });

        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");
        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");
        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");
        expect(urlInputBox.value).toBe("https://hello_world");
        expect(titleInputBox.value).toBe("a");
        expect(descInputBox.value).toBe("b");
    });

    test("test2 クリップボードの値がURLでない場合は入力しない", async () => {
        startMockClipboardManager("not_url://hello_world")

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <CreateNewBookmarkPage></CreateNewBookmarkPage>
                </HotkeysProvider>
            );
        });

        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");
        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");
        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");
        expect(urlInputBox.value).toBe("");
        expect(titleInputBox.value).toBe("");
        expect(descInputBox.value).toBe("");
    });
});
