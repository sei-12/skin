import { test, vi } from "vitest";
import { WindowVisibleController } from "./windowVisibleController";

vi.mock("@tauri-apps/api/event", () => ({
    listen: vi.fn(),
}));

vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: vi.fn(() => ({
        setVisibleOnAllWorkspaces: vi.fn(),
    })),
}));

vi.mock("@tauri-apps/plugin-global-shortcut", () => ({
    register: vi.fn(async () => {}),
    unregisterAll: vi.fn(async () => {}),
}));

export function startMockWindowVisibleController() {
    vi.spyOn(WindowVisibleController, "currentVisible").mockImplementation(
        async () => {
            return true;
        },
    );
    vi.spyOn(WindowVisibleController, "hide").mockImplementation(
        async () => {},
    );
    vi.spyOn(WindowVisibleController, "show").mockImplementation(
        async () => {},
    );
    vi.spyOn(WindowVisibleController, "toggle");
}

// テストがないファイルがエラーになる
test("");
