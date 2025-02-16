import { test, vi } from "vitest";
import { ClipBoardManager } from "./clipboard";

export function startMockClipboardManager(retVal: string) {
    vi.spyOn(ClipBoardManager, "read").mockImplementation(async () => {
        return retVal;
    });
}

test("");
