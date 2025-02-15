import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HotkeysProvider } from "react-hotkeys-hook";
import userEvent from "@testing-library/user-event";
import { HOTKEY_SCOPES } from "./hotkey";
import { TagListPage } from "../pages/pages";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { DB } from "../services/database";
import { NoticeProvider } from "../providers/NoticeProvider";
import { useNavigate } from "react-router-dom";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn() }));
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));
vi.mock("@tauri-apps/plugin-global-shortcut", () => ({ register: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

describe("TagListPage", () => {
    let nav = vi.fn();

    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
        vi.mock("react-router-dom");
        nav = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(nav);

        await act(async () => {
            render(
                <HotkeysProvider
                    initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
                >
                    <NoticeProvider>
                        <TagListPage></TagListPage>
                    </NoticeProvider>
                </HotkeysProvider>,
            );
        });
    });

    test("test1", async () => {
        const user = userEvent.setup();

        const item = screen.getByTestId(`tag-item-0-typescript`);

        const textBox = within(item).getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        await user.type(textBox, "hello");
        const buttons = within(item).getAllByRole("button");
        const editButton = buttons[0];

        expect(buttons.length).toBe(1);
        expect(editButton).toBeInTheDocument();

        await user.click(editButton);

        expect(DB.editTag).toBeCalledTimes(1);
        expect(DB.editTag).toBeCalledWith(0, "typescripthello");
    });

    test("test2", async () => {
        const user = userEvent.setup();
        const backButton = screen.getByText("back");
        await user.click(backButton);
        expect(nav).toBeCalledTimes(1);
        expect(nav).toBeCalledWith("/");
    });
});
