import { test, describe, beforeEach, vi, expect } from "vitest";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import { useLocation, useNavigate } from "react-router-dom";
import { render, renderHook } from "@testing-library/react";
import { useEditBookmarkPage } from "./EditBookmarkPage";
import { BookmarkForm } from "../components/BookmarkForm";
import userEvent from "@testing-library/user-event";
import { DB } from "../services/database";

describe("EditBookmarkPage", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.mock("react-router-dom");
        startMockWindowVisibleController();
        startMockDB();
    });

    test("test1", async () => {
        const nav = vi.fn();
        const user = userEvent.setup();

        vi.mocked(useNavigate).mockReturnValue(nav);
        vi.mocked(useLocation).mockReturnValue({
            state: {
                bookmarkId: 1,
            },
            key: "",
            hash: "",
            pathname: "",
            search: "",
        });

        const wrapper: React.FC<{ children: React.ReactNode }> = ({
            children,
        }) => (
            <HotkeysProvider
                initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
            >
                {children}
            </HotkeysProvider>
        );

        const hook = renderHook(
            () => {
                return useEditBookmarkPage();
            },
            { wrapper }
        );

        expect(DB.getBookmark).toBeCalledWith(1)

        render(<BookmarkForm {...hook.result.current}></BookmarkForm>);

        await user.keyboard("{Control>}{Enter}{/Control}");
        expect(nav).toBeCalledTimes(1);
        expect(DB.editBookmark).toBeCalledTimes(1);
        expect(DB.editBookmark).toBeCalledWith(1, "hello1", "url", "d", [
            "rust",
            "sass",
        ]);

        await user.keyboard("{Escape}");
        expect(nav).toBeCalledTimes(2);
        expect(nav).toBeCalledWith("/");
    });
});
