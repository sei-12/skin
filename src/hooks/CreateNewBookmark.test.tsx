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
import { NoticeProvider } from "../providers/NoticeProvider";

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
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
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
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
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
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
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

    test("test4 /を押した時にタグ入力ボックスにフォーカス", async () => {
        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
                </HotkeysProvider>
            );
        });
        const user = userEvent.setup();
        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");

        await user.keyboard("/");
        expect(predicateInputBox).toHaveFocus();
        expect(predicateInputBox.value).toBe("");

        await user.keyboard("/");
        expect(predicateInputBox.value).toBe("/");
    });

    test("test5 /を入力する事ができる", async () => {
        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
                </HotkeysProvider>
            );
        });
        const user = userEvent.setup();

        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");

        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");

        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");

        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");

        await user.keyboard("/");
        expect(predicateInputBox).toHaveFocus();
        expect(predicateInputBox.value).toBe("");

        await user.click(urlInputBox);
        await user.keyboard("/");
        expect(urlInputBox.value).toBe("/");
        expect(predicateInputBox).not.toHaveFocus();

        await user.click(titleInputBox);
        await user.keyboard("/");
        expect(titleInputBox.value).toBe("a/");
        expect(predicateInputBox).not.toHaveFocus();

        await user.click(descInputBox);
        await user.keyboard("/");
        expect(descInputBox.value).toBe("b/");
        expect(predicateInputBox).not.toHaveFocus();
    });
    
    test("test6 結果を通知", async () => {
        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
                </HotkeysProvider>
            );
        });
        const user = userEvent.setup();

        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");

        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");

        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");

        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");

        await user.click(predicateInputBox);
        await user.type(predicateInputBox, "t");
        await user.type(predicateInputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(titleInputBox, "hello");
        await user.type(descInputBox, "description");
        await user.type(urlInputBox, "url://hello");

        // この時点では表示されていない
        expect(() => {
            screen.getByText("SUCCESS!");
        }).toThrow();

        const doneButton = screen.getByText("Done");
        expect(doneButton).toBeInTheDocument();
        await user.click(doneButton);
        
        // 通知が表示されている
        expect(screen.getByText("SUCCESS!")).toBeInTheDocument();


        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript"]
        );
        
        
    })
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
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
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
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
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
            "javascript",
        ]);
    });

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
            "javascript",
        ]);
    });
});

describe("fix bug", () => {
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
                    title: "",
                    desc: "",
                };
            }
        });

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                    </NoticeProvider>
                </HotkeysProvider>
            );
        });
    });

    test("create new bookmarkでスペースを押した時に重複するタグを入れることができるバグ", async () => {
        const user = userEvent.setup();
        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");

        await user.type(titleInputBox, "title");
        await user.type(urlInputBox, "url");
        await user.type(predicateInputBox, "t{Enter}");
        await user.type(predicateInputBox, "typescript{Space}");
        expect(predicateInputBox.value).toBe(""); // クリアされる

        await user.type(predicateInputBox, "t{Enter}");
        await user.type(predicateInputBox, "javascript{Space}");
        expect(predicateInputBox.value).toBe(""); // クリアされる

        await user.type(urlInputBox, "a");
        await user.type(descInputBox, "desc");
        await user.type(titleInputBox, "a");

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith("titlea", "urla", "desc", [
            "typescript",
            "javascript",
        ]);
    });
});
