import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBookmarkList } from "./BookmarkList";

describe("BookmarkList", () => {
    it("case1", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock),
        );

        expect(hook.result.current.items).toEqual([]);
    });

    it("case2", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock),
        );

        const items = [
            {
                id: 1,
                title: "title1",
                url: "url1",
                desc: "desc1",
                tags: ["tag1", "tag2"],
                created_at: "2025-02-07",
            },
            {
                id: 2,
                title: "title2",
                url: "url2",
                desc: "desc2",
                tags: ["tag3", "tag4"],
                created_at: "2025-02-07",
            },
            {
                id: 3,
                title: "title3",
                url: "url3",
                desc: "desc3",
                tags: ["tag5", "tag6"],
                created_at: "2025-02-07",
            },
        ];
        act(() => {
            hook.result.current.setItems(items);
        });

        expect(hook.result.current.items).toEqual(items);
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
        act(() => {
            hook.result.current.focusDown();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[1]);
        act(() => {
            hook.result.current.focusDown();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[2]);
        act(() => {
            hook.result.current.focusDown();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
    });

    it("case3", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock),
        );

        const items = [
            {
                id: 1,
                title: "title1",
                url: "url1",
                desc: "desc1",
                tags: ["tag1", "tag2"],
                created_at: "2025-02-07",
            },
            {
                id: 2,
                title: "title2",
                url: "url2",
                desc: "desc2",
                tags: ["tag3", "tag4"],
                created_at: "2025-02-07",
            },
            {
                id: 3,
                title: "title3",
                url: "url3",
                desc: "desc3",
                tags: ["tag5", "tag6"],
                created_at: "2025-02-07",
            },
        ];
        act(() => {
            hook.result.current.setItems(items);
        });

        expect(hook.result.current.items).toEqual(items);
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
        act(() => {
            hook.result.current.focusUp();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[2]);
        act(() => {
            hook.result.current.focusUp();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[1]);
        act(() => {
            hook.result.current.focusUp();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
    });

    it("case4", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock),
        );

        const items = [
            {
                id: 1,
                title: "title1",
                url: "url1",
                desc: "desc1",
                tags: ["tag1", "tag2"],
                created_at: "2025-02-07",
            },
            {
                id: 2,
                title: "title2",
                url: "url2",
                desc: "desc2",
                tags: ["tag3", "tag4"],
                created_at: "2025-02-07",
            },
            {
                id: 3,
                title: "title3",
                url: "url3",
                desc: "desc3",
                tags: ["tag5", "tag6"],
                created_at: "2025-02-07",
            },
        ];

        act(() => {
            hook.result.current.setItems(items);
        });

        expect(hook.result.current.items).toEqual(items);
        act(() => {
            hook.result.current.focusUp();
        });
        act(() => {
            hook.result.current.focusUp();
        });
        act(() => {
            hook.result.current.resetFocusIndex();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
        act(() => {
            hook.result.current.focusUp();
        });
        act(() => {
            hook.result.current.focusUp();
        });
        act(() => {
            hook.result.current.focusUp();
        });
        act(() => {
            hook.result.current.resetFocusIndex();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
        act(() => {
            hook.result.current.focusDown();
        });
        act(() => {
            hook.result.current.focusDown();
        });
        act(() => {
            hook.result.current.resetFocusIndex();
        });
        expect(hook.result.current.getFocusedItem()).toEqual(items[0]);
    });
    it("case5", async () => {
        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock),
        );

        act(() => {
            hook.result.current.setItems([]);
        });

        expect(hook.result.current.getFocusedItem()).toEqual(undefined);
    });
});
