import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import { CreateNewBookmarkPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { startMockClipboardManager } from "../services/mockClipboard.test";
import userEvent from "@testing-library/user-event";
import { DB } from "../services/database";
import { invoke } from "@tauri-apps/api/core";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@tauri-apps/api/core");

describe("CreateNewBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        vi.mocked(invoke).mockImplementation(async (cmd: string) => {
            if (cmd === "get_config") {
                return DEFAULT_CONFIG;
            }
            if (cmd === "fetch_website_content") {
                return {
                    title: "a",
                    desc: "b",
                };
            }
        });
    });

    test("test1", async () => {
        startMockClipboardManager("https://hello_world");

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
        startMockClipboardManager("not_url://hello_world");

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

    test("test3", async () => {
        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <CreateNewBookmarkPage></CreateNewBookmarkPage>
                </HotkeysProvider>
            );
        });

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
            ["typescript"]
        );
    });
});

describe("CreateNewBookmark.insert1", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        startMockClipboardManager("https://hello_world");

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <CreateNewBookmarkPage></CreateNewBookmarkPage>
                </HotkeysProvider>
            );
        });
    });

    test("test1", async () => {
        const user = userEvent.setup();
        const predicateInputBox = screen.getByPlaceholderText("/");

        await user.click(predicateInputBox);
        await user.type(predicateInputBox, "t");
        await user.type(predicateInputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        const doneButton = screen.getByText("Done");
        await user.click(doneButton);

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "a",
            "https://hello_world",
            "b",
            ["typescript"]
        );
    });

    test("test2", async () => {
        const user = userEvent.setup();
        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox = screen.getByPlaceholderText("/");

        await user.type(predicateInputBox, "t{Enter}");
        await user.type(urlInputBox, "a");
        await user.type(titleInputBox, "a");
        await user.type(descInputBox, "desc");

        await user.click(screen.getByText("Done"));

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "aa",
            "https://hello_worlda",
            "bdesc",
            ["typescript"]
        );
    });
});

describe("CreateNewBookmark.insert2", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        startMockClipboardManager("");
        vi.mocked(invoke).mockImplementation(async (cmd: string) => {
            if (cmd === "get_config") {
                return DEFAULT_CONFIG;
            }
            if (cmd === "fetch_website_content") {
                return { title: "", desc: "" };
            }
        });

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <CreateNewBookmarkPage></CreateNewBookmarkPage>
                </HotkeysProvider>
            );
        });
    });

    test("test2", async () => {
        const user = userEvent.setup();
        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox = screen.getByPlaceholderText("/");

        await user.type(predicateInputBox, "t{Enter}");
        await user.type(urlInputBox, "a");
        await user.type(titleInputBox, "a");
        await user.type(descInputBox, "desc");

        await user.click(screen.getByText("Done"));

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith("a", "a", "desc", [
            "typescript",
        ]);
    });
    test("test3", async () => {
        const user = userEvent.setup();
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

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith("titlea", "urla", "desc", [
            "typescript",
            "javascript"
        ]);
    })

    test("test4", async () => {
        const user = userEvent.setup();
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

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith("titlea", "urla", "desc", [
            "typescript",
            "javascript"
        ]);
    })
});
