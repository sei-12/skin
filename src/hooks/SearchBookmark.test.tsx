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

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(), }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn(), }));
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn(), }));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn((a) => console.log(a)),
}));

describe("SearchBookmark", () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        startMockWindowVisibleController()
        startMockDB()

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
        expect(WindowVisibleController.hide).toBeCalledTimes(1)
    });
    
    
});
