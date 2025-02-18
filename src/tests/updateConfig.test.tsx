import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { App } from "../App";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import type { EventCallback } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("update config", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        startMockDB();
        startMockWindowVisibleController();
        vi.mock("@tauri-apps/api/event");
        vi.mock("@tauri-apps/api/core");
    });

    test("test1 keybind", async () => {
        let callback: EventCallback<unknown> = () => {};
        const conf = structuredClone(DEFAULT_CONFIG);

        vi.mocked(listen).mockImplementation(async (_, handler) => {
            callback = handler;
            return vi.fn();
        });

        vi.mocked(invoke).mockImplementation(async (cmd: string) => {
            if (cmd === "get_config") {
                return { ...conf };
            }
            if (cmd === "fetch_website_content") {
                return {
                    title: "",
                    desc: "",
                };
            }
        });

        await act(async () => {
            render(<App></App>);
        });

        const user = userEvent.setup();

        // focusDownBookmarkList
        await user.keyboard("{ArrowDown}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(1);
        await user.keyboard("{Control>}k{/Control}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(1);
        conf.keybinds.focusDownBookmarkList = "ctrl+k";
        callback({ event: "", id: 1, payload: null });
        await waitFor(async () => {
            await user.keyboard("{Control>}k{/Control}");
            expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(
                2,
            );
        });
        conf.keybinds.focusDownBookmarkList = ["ctrl+n", "ArrowDown"];
        callback({ event: "", id: 1, payload: null });
        await waitFor(async () => {
            await user.keyboard("{Control>}k{/Control}");
            expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(
                2,
            );
        });

        // focusUpBookmarkList
        await user.keyboard("{ArrowUp}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(3);
        await user.keyboard("{Control>}l{/Control}");
        expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(3);
        conf.keybinds.focusUpBookmarkList = "ctrl+l";
        callback({ event: "", id: 1, payload: null });
        await waitFor(async () => {
            await user.keyboard("{Control>}l{/Control}");
            expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(
                4,
            );
        });
    });

    test("test2 colorTheme", async () => {
        let callback: EventCallback<unknown> = () => {};
        const conf = structuredClone(DEFAULT_CONFIG);

        vi.mocked(listen).mockImplementation(async (_, handler) => {
            callback = handler;
            return vi.fn();
        });

        vi.mocked(invoke).mockImplementation(async (cmd: string) => {
            if (cmd === "get_config") {
                return { ...conf };
            }
            if (cmd === "fetch_website_content") {
                return {
                    title: "",
                    desc: "",
                };
            }
        });

        await act(async () => {
            render(<App></App>);
        });

        const user = userEvent.setup();

        await user.keyboard("/t{Enter}");
        const tagelm = screen.getByText("typescript");
        expect(tagelm).toHaveStyle(
            "color: " + DEFAULT_CONFIG.colorTheme.tagItem.exists + ";",
        );

        conf.colorTheme.tagItem.exists = "rgb(255,0,0)";
        callback({ event: "", id: 1, payload: null });
        await waitFor(async () => {
            const tagelm = screen.getByText("typescript");
            expect(tagelm).toHaveStyle("color: rgb(255,0,0);");
        });

        conf.colorTheme.tagItem.exists = "rgb(255,255,0)";
        callback({ event: "", id: 1, payload: null });
        await waitFor(async () => {
            const tagelm = screen.getByText("typescript");
            expect(tagelm).toHaveStyle("color: rgb(255,255,0);");
        });
    });
});
