import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import userEvent from "@testing-library/user-event";
import { HOTKEY_SCOPES } from "../lib/hotkey";
import { SearchBookmarkPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../lib/windowVisibleController.test";
import { WindowVisibleController } from "../lib/windowVisibleController";

const testData = {
    bookmarks: [
        {
            id: 1,
            title: "Example",
            url: "https://example.com",
            desc: "An example bookmark",
            tags: ["example", "test"],
        },
        {
            id: 2,
            title: "Vitest Docs",
            url: "https://vitest.dev",
            desc: "Testing framework documentation",
            tags: ["testing", "documentation"],
        },
    ],
    tags: ["example", "test", "testing", "documentation"],
};

vi.mock("../lib/database", () => ({
    dbConnection: {
        insertBookmark: vi.fn(async (title, url, desc, tags) => {
            const newBookmark = {
                id: testData.bookmarks.length + 1,
                title,
                url,
                desc,
                tags,
            };
            testData.bookmarks.push(newBookmark);
        }),

        deleteBookmark: vi.fn(async (id) => {
            testData.bookmarks = testData.bookmarks.filter(
                (bookmark) => bookmark.id !== id
            );
        }),

        insertTag: vi.fn(async (tag) => {
            if (!testData.tags.includes(tag)) {
                testData.tags.push(tag);
            }
        }),

        isExistsTag: vi.fn(async (tag) => {
            return testData.tags.includes(tag);
        }),

        findBookmark: vi.fn(async (tags) => {
            return testData.bookmarks.filter((bookmark) =>
                tags.every((tag: string) => bookmark.tags.includes(tag))
            );
        }),

        findTag: vi.fn(async (predicate) => {
            return testData.tags.filter((tag) => tag.includes(predicate));
        }),
    },
}));

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
