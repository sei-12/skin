import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "./lib/windowVisibleController.test";
import { WindowVisibleController } from "./lib/windowVisibleController";
import { startMockDB } from "./lib/database.test";
import { DB } from "./lib/database";
import { App } from "./App";
import { DEFAULT_CONFIG } from "./providers/configProvider";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));

vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(async (cmd: string ) => {
        if (cmd === "get_config") {
            return DEFAULT_CONFIG;
        }
        if ( cmd === "fetch_website_content" ){
            return {
                title: "",
                desc: ""
            }
        }
    }),
}));

describe("App.SearchBookmark", () => {
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
        expect(screen.getByPlaceholderText("/")).not.toHaveFocus();
        await user.keyboard("/");
        const predicateInputBox = screen.getByTestId(
            "taginputbox-predicateinputbox"
        );
        expect(predicateInputBox).toBeInTheDocument();
        expect(screen.getByPlaceholderText("/")).toHaveFocus();
    });

    test("test2", async () => {
        const user = userEvent.setup();
        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(1);
    });

    test("test3", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.findTag).toBeCalledTimes(1);

        // TestingLibraryElementError
        expect(() => screen.getAllByTestId("bkmkitem")).toThrow();

        await user.type(inputBox, "y");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(1);
        expect(DB.findTag).toBeCalledTimes(2);

        await user.type(inputBox, "{Enter}");

        expect(DB.findBookmark).toBeCalledTimes(2);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(4);
        expect(screen.getAllByText("typescript").length).toBe(1);
        expect(screen.getAllByText("#typescript").length).toBe(4);
        expect(screen.getByText("hello8")).toBeInTheDocument();
        expect(screen.getByText("hello12")).toBeInTheDocument();
        expect(screen.getByText("hello14")).toBeInTheDocument();
        expect(screen.getByText("hello18")).toBeInTheDocument();

        await user.type(inputBox, "{Backspace}");
        expect(() => screen.getAllByTestId("bkmkitem")).toThrow();
        expect(DB.findBookmark).toBeCalledTimes(3);
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();
    });

    test("test4", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        await user.type(inputBox, "tya");
        expect(() => screen.getAllByTestId("bkmkitem")).toThrow();
        expect(() => screen.getAllByTestId("suggestion-item")).toThrow();
        expect(screen.getByTestId("suggestion-window")).not.toBeVisible();

        expect(DB.findTag).toBeCalledTimes(3); // タイプ数
        expect(DB.deleteBookmark).toBeCalledTimes(0);
        expect(DB.findBookmark).toBeCalledTimes(1); //一番初めに一度呼ばれる
        expect(DB.insertBookmark).toBeCalledTimes(0);
        expect(DB.isExistsTag).toBeCalledTimes(0);
    });

    test("test5", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = function () {};

        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.findTag).toBeCalledTimes(1);

        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(DB.findBookmark).toBeCalledTimes(2);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(3);
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("javascript").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.keyboard("{Control>}N{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}P{/Control}");
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("gist").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
    });

    test("test6 Backspace時に1個ずつタグを削除していく", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test7 Backspace時に1個ずつタグを削除していく(2)", async () => {
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "t");
        expect(DB.findTag).toBeCalledTimes(4);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);

        await user.type(inputBox, "a");
        expect(DB.findTag).toBeCalledTimes(5);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(5);

        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.type(inputBox, "{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    test("test8 Backspace時に1個ずつタグを削除していく(3)", async () => {
        // type(inputBox) -> keyboard()
        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(1);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(2);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);

        await user.type(inputBox, "y");
        expect(DB.findTag).toBeCalledTimes(3);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);

        await user.type(inputBox, "t");
        expect(DB.findTag).toBeCalledTimes(4);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);

        await user.type(inputBox, "a");
        expect(DB.findTag).toBeCalledTimes(5);
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(5);

        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(4);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(3);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        await user.keyboard("{Backspace}");
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.keyboard("{Backspace}");
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    });

    // create-new-bookmark
});

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

        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
    });
    
    test("test3", async () => {
        const user = userEvent.setup();
        expect(screen.getByTestId("create-new-bookmark")).toBeInTheDocument();

        const toCreate = async () => {
            user.click(screen.getByPlaceholderText("/"))
            await user.keyboard("{Control>}A{/Control}");
            expect(
                screen.getByTestId("create-new-bookmark")
            ).toBeInTheDocument();
        };
        const toSearch = async () => {
            const cancelButton = screen.getByText("Cancel");
            user.click(screen.getByPlaceholderText("/"))
            expect(cancelButton).toBeInTheDocument();
            await user.click(cancelButton);
            expect(WindowVisibleController.hide).toBeCalledTimes(0);
            expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
        };

        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
        await toSearch()
        await toCreate()
    })   

    test("test4",async () => {
        const user = userEvent.setup()

        const urlInputBox = screen.getByPlaceholderText("url")
        const titleInputBox = screen.getByPlaceholderText("title")
        const descInputBox = screen.getByPlaceholderText("desc")
        const predicateInputBox = screen.getByPlaceholderText("/")
        
        expect(urlInputBox).toBeInTheDocument()
        expect(titleInputBox).toBeInTheDocument()
        expect(descInputBox).toBeInTheDocument()
        expect(predicateInputBox).toBeInTheDocument()
        
        await user.click(predicateInputBox)
        await user.type(predicateInputBox,"t")
        await user.type(predicateInputBox,"{Enter}")
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
    })

    test("test5",async () => {
        const user = userEvent.setup()

        const urlInputBox = screen.getByPlaceholderText("url")
        const titleInputBox = screen.getByPlaceholderText("title")
        const descInputBox = screen.getByPlaceholderText("desc")
        const predicateInputBox = screen.getByPlaceholderText("/")
        
        expect(urlInputBox).toBeInTheDocument()
        expect(titleInputBox).toBeInTheDocument()
        expect(descInputBox).toBeInTheDocument()
        expect(predicateInputBox).toBeInTheDocument()
        
        await user.click(predicateInputBox)
        await user.type(predicateInputBox,"t")
        await user.type(predicateInputBox,"{Enter}")
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        
        await user.type(titleInputBox,"hello")
        await user.type(descInputBox,"description")
        await user.type(urlInputBox,"url://hello")
        
        const doneButton = screen.getByText("Done")
        expect(doneButton).toBeInTheDocument()
        await user.click(doneButton)
        
        expect(DB.insertBookmark).toBeCalledTimes(1)
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript"]
        )
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    })

    test("test6",async () => {
        const user = userEvent.setup()

        const urlInputBox: HTMLInputElement = screen.getByPlaceholderText("url")
        const titleInputBox: HTMLInputElement = screen.getByPlaceholderText("title")
        const descInputBox: HTMLInputElement = screen.getByPlaceholderText("desc")
        const predicateInputBox: HTMLInputElement = screen.getByPlaceholderText("/")
        
        expect(urlInputBox).toBeInTheDocument()
        expect(titleInputBox).toBeInTheDocument()
        expect(descInputBox).toBeInTheDocument()
        expect(predicateInputBox).toBeInTheDocument()
        
        await user.click(predicateInputBox)
        await user.type(predicateInputBox,"t")
        await user.type(predicateInputBox,"{Enter}")
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        
        await user.type(titleInputBox,"hello")
        await user.type(descInputBox,"description")
        await user.type(urlInputBox,"url://hello")
        
        expect(titleInputBox.value).toBe("hello")
        expect(descInputBox.value).toBe("description")
        expect(urlInputBox.value).toBe("url://hello")

        await user.keyboard("{Escape}");
        expect(WindowVisibleController.hide).toBeCalledTimes(0);
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();

        await user.keyboard("{Control>}A{/Control}");
        const urlInputBox2: HTMLInputElement = screen.getByPlaceholderText("url")
        const titleInputBox2: HTMLInputElement = screen.getByPlaceholderText("title")
        const descInputBox2: HTMLInputElement = screen.getByPlaceholderText("desc")
        expect(titleInputBox2.value).toBe("")
        expect(descInputBox2.value).toBe("")
        expect(urlInputBox2.value).toBe("")
        expect(() => screen.getAllByTestId("taginputbox-tagitem")).toThrow();
    })

    test("test7",async () => {
        const user = userEvent.setup()

        const urlInputBox = screen.getByPlaceholderText("url")
        const titleInputBox = screen.getByPlaceholderText("title")
        const descInputBox = screen.getByPlaceholderText("desc")
        const predicateInputBox = screen.getByPlaceholderText("/")
        
        expect(urlInputBox).toBeInTheDocument()
        expect(titleInputBox).toBeInTheDocument()
        expect(descInputBox).toBeInTheDocument()
        expect(predicateInputBox).toBeInTheDocument()
        
        await user.click(predicateInputBox)
        await user.type(predicateInputBox,"t")
        await user.type(predicateInputBox,"{Enter}")
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(1);
        await user.type(predicateInputBox,"helloworld-aaaa")
        await user.type(predicateInputBox,"{Space}")
        expect(screen.getAllByTestId("taginputbox-tagitem").length).toBe(2);
        
        await user.type(titleInputBox,"hello")
        await user.type(descInputBox,"description")
        await user.type(urlInputBox,"url://hello")
        
        await user.keyboard("{Control>}{Enter}{/Control}");
        
        expect(DB.insertBookmark).toBeCalledTimes(1)
        expect(DB.insertBookmark).toBeCalledWith(
            "hello",
            "url://hello",
            "description",
            ["typescript", "helloworld-aaaa"]
        )
        expect(screen.getByTestId("search-bookmark")).toBeInTheDocument();
    })
});
