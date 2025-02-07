import { act, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { BookmarkList } from "./BookmarkList";
import { useBookmarkList } from "../hooks/BookmarkList";

describe("BookmarkList.tsx", () => {
    it("case1", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = function () {};

        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock)
        );

        act(() => {
            hook.result.current.setItems(items);
        });

        const result = render(
            <BookmarkList {...hook.result.current.props}></BookmarkList>
        );

        const bkmkItems = screen.getAllByTestId("bkmkitem");
        expect(bkmkItems.length).toBe(items.length);

        expect(result.asFragment()).toMatchSnapshot();

        items.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
            expect(screen.getByText(item.desc)).toBeInTheDocument();
            item.tags.forEach((tag) => {
                expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
            });
        });
    });

    it("case2", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = vi.fn();

        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock)
        );

        act(() => {
            hook.result.current.setItems(items);
        });

        render(<BookmarkList {...hook.result.current.props}></BookmarkList>);

        act(() => hook.result.current.focusDown());
        act(() => hook.result.current.focusDown());
        act(() => hook.result.current.focusDown());
        expect(
            window.HTMLElement.prototype.scrollIntoView
        ).toHaveBeenCalledTimes(3);

        act(() => hook.result.current.focusUp());
        act(() => hook.result.current.focusUp());
        act(() => hook.result.current.focusUp());
        expect(
            window.HTMLElement.prototype.scrollIntoView
        ).toHaveBeenCalledTimes(6);
    });

    it("case3 itemsが空の場合はscrollIntoViewが呼ばれない", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
        window.HTMLElement.prototype.scrollIntoView = vi.fn();

        const onClickRemoveMock = vi.fn();
        const onClickCancelMock = vi.fn();

        const hook = renderHook(() =>
            useBookmarkList(onClickRemoveMock, onClickCancelMock)
        );

        render(<BookmarkList {...hook.result.current.props}></BookmarkList>);

        act(() => hook.result.current.focusDown());
        act(() => hook.result.current.focusDown());
        act(() => hook.result.current.focusDown());

        //
        expect(
            window.HTMLElement.prototype.scrollIntoView
        ).toHaveBeenCalledTimes(0);

        act(() => hook.result.current.focusUp());
        act(() => hook.result.current.focusUp());
        act(() => hook.result.current.focusUp());
        expect(
            window.HTMLElement.prototype.scrollIntoView
        ).toHaveBeenCalledTimes(0);
    });
});

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
