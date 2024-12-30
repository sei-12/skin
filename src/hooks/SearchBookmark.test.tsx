import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import userEvent from "@testing-library/user-event";
import { HOTKEY_SCOPES } from "../lib/hotkey";
import { SearchBookmarkPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../lib/windowVisibleController.test";
import { WindowVisibleController } from "../lib/windowVisibleController";
import { startMockDB } from "../lib/database.test";
import { DB } from "../lib/database";

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

describe("SearchBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <SearchBookmarkPage></SearchBookmarkPage>
                </HotkeysProvider>
            );
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
        window.HTMLElement.prototype.scrollIntoView = function() {};

        const user = userEvent.setup();
        const inputBox = screen.getByPlaceholderText("/");

        expect(DB.findBookmark).toBeCalledTimes(1);
        await user.type(inputBox, "t");
        expect(screen.getAllByTestId("suggestion-item").length).toBe(8);
        expect(DB.findTag).toBeCalledTimes(1);
        
        await user.keyboard("{Control>}N{/Control}")
        await user.type(inputBox, "{Enter}");
        expect(DB.findBookmark).toBeCalledTimes(2);
        expect(screen.getAllByTestId("bkmkitem").length).toBe(3);
        expect(screen.getAllByText("javascript").length).toBe(1);
        expect(screen.getAllByText("#javascript").length).toBe(3);
        await user.type(inputBox, "{Backspace}");
        
        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}")
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("javascript").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        
        
        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        
        
        await user.type(inputBox, "t");
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.keyboard("{Control>}N{/Control}")
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("python").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        

        await user.type(inputBox, "t");
        await user.keyboard("{Control>}P{/Control}")
        await user.type(inputBox, "{Enter}");
        expect(screen.getAllByText("gist").length).toBe(1);
        await user.type(inputBox, "{Backspace}");
        
    });
});
