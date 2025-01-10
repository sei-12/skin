
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { WindowVisibleController } from "../services/windowVisibleController";
import { startMockDB } from "../services/database.test";
import { DB } from "../services/database";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";

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

    test("test1", async () => {
        const user = userEvent.setup();
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(0);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();

        await user.keyboard("{Control>}A{/Control}");
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(0);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();

        await user.keyboard("{Control>}A{/Control}");
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(0);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("test2", async () => {
        const user = userEvent.setup();
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        const toCreate = async () => {
            await user.keyboard("{Control>}A{/Control}");
            expect(
                screen.getByTestId("create-new-bookmark")
            ).toBeInTheDocument();
        };
        const toSearch = async () => {
            const cancelButton = screen.getByText("Cancel");
            expect(cancelButton).toBeInTheDocument();
            await user.click(cancelButton);
            expect(WindowVisibleController.hide).toBeCalledTimes(0);
            expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
        };

        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
    });

    test("test3", async () => {
        const user = userEvent.setup();
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        const toCreate = async () => {
            await user.click(screen.getByPlaceholderText("/"));
            await user.keyboard("{Control>}A{/Control}");
            expect(
                screen.getByTestId("create-new-bookmark")
            ).toBeInTheDocument();
        };
        const toSearch = async () => {
            const cancelButton = screen.getByText("Cancel");
            await user.click(screen.getByPlaceholderText("/"));
            expect(cancelButton).toBeInTheDocument();
            await user.click(cancelButton);
            expect(WindowVisibleController.hide).toBeCalledTimes(0);
            expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
        };

        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
        await toSearch();
        await toCreate();
    });

    test("test4", async () => {
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
    });

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
            ["typescript"]
        );
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("test6", async () => {
        const user = userEvent.setup();

        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");
        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");
        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");
        const predicateInputBox: HTMLInputElement =
            screen.getByPlaceholderText("/");

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

        expect(titleInputBox.value).toBe("hello");
        expect(descInputBox.value).toBe("description");
        expect(urlInputBox.value).toBe("url://hello");

        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(0);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();

        await user.keyboard("{Control>}A{/Control}");
        const urlInputBox2: HTMLInputElement =
            screen.getByPlaceholderText("url");
        const titleInputBox2: HTMLInputElement =
            screen.getByPlaceholderText("title");
        const descInputBox2: HTMLInputElement =
            screen.getByPlaceholderText("desc");
        expect(titleInputBox2.value).toBe("");
        expect(descInputBox2.value).toBe("");
        expect(urlInputBox2.value).toBe("");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test7", async () => {
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
        await user.type(predicateInputBox, "helloworld-aaaa");
        await user.type(predicateInputBox, "{Space}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(titleInputBox, "hello");
        await user.type(descInputBox, "description");
        await user.type(urlInputBox, "url://hello");

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript", "helloworld-aaaa"]
        );
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("test8", async () => {
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
        await user.type(predicateInputBox, "helloworld-aaaa");
        await user.type(predicateInputBox, "{Space}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.type(predicateInputBox, "{Backspace}");

        await user.type(titleInputBox, "hello");
        await user.type(descInputBox, "description");
        await user.type(urlInputBox, "url://hello");

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript"]
        );
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("タグではない入力ボックスでバックスペースを押した時にタグが削除される不具合", async () => {
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
        await user.type(predicateInputBox, "helloworld-aaaa");
        await user.type(predicateInputBox, "{Space}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(titleInputBox, "hello");
        expect(titleInputBox).toHaveFocus();
        await user.type(titleInputBox, "{Backspace}");
        await user.type(descInputBox, "description");
        await user.type(urlInputBox, "url://hello");

        await user.keyboard("{Control>}{Enter}{/Control}");

        expect(DB.insertBookmark).toBeCalledTimes(1);
        expect(DB.insertBookmark).toBeCalledWith(
            "hell",
            "url://hello",
            "description",
            ["typescript", "helloworld-aaaa"]
        );
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    });

    test("タグではない入力ボックスでバックスペースを押した時にタグが削除される不具合 case2", async () => {
        const user = userEvent.setup();
        const urlInputBox = screen.getByPlaceholderText("url");
        const titleInputBox = screen.getByPlaceholderText("title");
        const descInputBox = screen.getByPlaceholderText("desc");
        const predicateInputBox = screen.getByPlaceholderText("/");

        let count = 0;
        const type = async (k: string) => {
            await user.type(predicateInputBox, k);
            await user.type(predicateInputBox, "{Enter}");
            count += 1;
            expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(
                count
            );
        };

        await type("t");
        await type("u");
        await type("s");
        await type("t");
        await type("u");
        await type("s");
        await type("f");

        await user.type(urlInputBox, "{Backspace}");
        await user.type(titleInputBox, "{Backspace}");
        await user.type(descInputBox, "{Backspace}");
        await user.type(urlInputBox, "{Backspace}");
        await user.type(titleInputBox, "{Backspace}");
        await user.type(descInputBox, "{Backspace}");

        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(count);
    });

    test("test10 Backspace時に1個ずつタグを削除していく", async () => {
        const user = userEvent.setup();
        const predicateInputBox = screen.getByPlaceholderText("/");

        let count = 0;
        const type = async (k: string) => {
            await user.type(predicateInputBox, k);
            await user.type(predicateInputBox, "{Enter}");
            count += 1;
            expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(
                count
            );
        };
        const back = async () => {
            await user.type(predicateInputBox, "{Backspace}");
            count -= 1;
            expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(
                count
            );
        };

        await type("t");
        await type("t");
        await type("a");
        await back();
        await back();
        await type("s");
        await type("f");
        await back();
        await type("t");
        await type("t");
        await back();
        await back();
        await type("a");
        await type("c");
        await type("e");
        await type("f");
        await back();
        await back();
    });
});
