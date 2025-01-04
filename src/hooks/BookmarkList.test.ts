import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBookmarkList } from "./BookmarkList";

describe("BookmarkList", () => {
    it("case1", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() => useBookmarkList(
            onClickRemoveMock,
            onClickCancelMock
        ));
        
        expect(hook.result.current.items).toEqual([]);
    });
});