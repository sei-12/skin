import { beforeEach, describe, expect, test, vi } from "vitest";
import { ClipBoardManager } from "./clipboard";
import { readText } from "@tauri-apps/plugin-clipboard-manager";


vi.mock("@tauri-apps/plugin-clipboard-manager")
describe("ClipBoardManager",() => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test("test1",async () => {
        vi.mocked(readText).mockImplementation(async() => {
            return "hello"
        })
        const result = await ClipBoardManager.read()
        expect(result).toBe("hello")
    })

    test("test2",async () => {
        vi.mocked(readText).mockImplementation(async() => {
            throw new Error("Unhandled Promise Rejection: The clipboard contents were not available in the requested format or the clipboard is empty.")
        })

        const result = await ClipBoardManager.read()
        expect(result).toBe("")
    })
})