import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import type { BookmarkItemProps } from "./BookmarkItem";
import { BookmarkItem } from "./BookmarkItem";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

describe("BookmarkItem", () => {
    const mockData: Bookmark = {
        id: 1,
        url: "aaa",
        title: "Sample Bookmark",
        desc: "This is a sample description for the bookmark item.",
        tags: ["tag1", "tag2", "tag3"],
        created_at: "2025-02-07",
    };

    const mockData2: Bookmark = {
        id: 2,
        url: "aaa",
        title: "Sample Bookmark",
        desc: "This is a sample description for the bookmark item.",
        tags: ["tag1", "tag2", "tag3"],
        created_at: null,
    };

    const defaultProps: BookmarkItemProps = {
        data: mockData,
        onClickRemove: vi.fn(),
        onClickEdit: vi.fn(),
        focus: false,
        colorTheme: DEFAULT_CONFIG.colorTheme,
    };

    it("renders the title, description, and tags", () => {
        render(<BookmarkItem {...defaultProps} />);

        expect(screen.getByText("Sample Bookmark")).toBeVisible();
        expect(
            screen.getByText(
                "This is a sample description for the bookmark item."
            )
        ).toBeInTheDocument();
        expect(screen.getByText("#tag1")).toBeInTheDocument();
        expect(screen.getByText("#tag2")).toBeInTheDocument();
        expect(screen.getByText("#tag3")).toBeInTheDocument();
        expect(screen.getByText("created at 2025/02/07")).toBeInTheDocument();
    });

    it("test2", () => {
        render(
            <BookmarkItem
                data={mockData2}
                onClickEdit={vi.fn()}
                onClickRemove={vi.fn()}
                focus={false}
                colorTheme={DEFAULT_CONFIG.colorTheme}
            />
        );

        expect(screen.getByText("Sample Bookmark")).toBeVisible();
        expect(
            screen.getByText(
                "This is a sample description for the bookmark item."
            )
        ).toBeInTheDocument();
        expect(screen.getByText("#tag1")).toBeInTheDocument();
        expect(screen.getByText("#tag2")).toBeInTheDocument();
        expect(screen.getByText("#tag3")).toBeInTheDocument();
        expect(screen.getByText("created at ----/--/--")).toBeInTheDocument();
    });

    it("applies the correct background color when focused", () => {
        const { container, rerender } = render(
            <BookmarkItem {...defaultProps} focus={true} />
        );

        expect(container.querySelector(".MuiCard-root")).toHaveStyle(
            `background-color: ${DEFAULT_CONFIG.colorTheme.bookmarkItem.focusBg}`
        );

        rerender(<BookmarkItem {...defaultProps} focus={false} />);

        expect(container.querySelector(".MuiCard-root")).toHaveStyle(
            `background-color: ${DEFAULT_CONFIG.colorTheme.bookmarkItem.bg}`
        );
    });


    it("onclick edit", async () => {
        const user = userEvent.setup();
        const handleClickRemove = vi.fn();
        const handleClickEdit = vi.fn();
        render(
            <BookmarkItem
                {...defaultProps}
                onClickRemove={handleClickRemove}
                onClickEdit={handleClickEdit}
            />
        );

        // クリックする前は表示されていない
        expect(() => screen.getByTestId("bookmarkitem-menu")).toThrow();

        const openMenuButton = screen.getByTestId("open-bookmark-button");
        await user.click(openMenuButton);

        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Edit"));
        expect(handleClickEdit).toBeCalledTimes(1);
        expect(handleClickEdit).toBeCalledWith(defaultProps.data.id);
    });

    it("onclick remove", async () => {
        const user = userEvent.setup();
        const handleClickRemove = vi.fn();
        const handleClickEdit = vi.fn();
        render(
            <BookmarkItem
                {...defaultProps}
                onClickRemove={handleClickRemove}
                onClickEdit={handleClickEdit}
            />
        );

        // クリックする前は表示されていない
        expect(() => screen.getByTestId("bookmarkitem-menu")).toThrow();

        const openMenuButton = screen.getByTestId("open-bookmark-button");
        await user.click(openMenuButton);

        const menuWindow = screen.getByTestId("bookmarkitem-menu");
        expect(menuWindow).toBeInTheDocument();
        await user.click(screen.getByText("Delete"));
        expect(handleClickRemove).toBeCalledTimes(1);
        expect(handleClickRemove).toBeCalledWith(defaultProps.data.id);
    });
    

    it("tag style", async () => {
        render(<BookmarkItem {...defaultProps} />);
        const tag = screen.getByText("#tag1");
        expect(tag).toHaveStyle(
            `color: ${DEFAULT_CONFIG.colorTheme.bookmarkItem.tag}`
        );
    });

    it("snapshot", () => {
        const { container } = render(
            <BookmarkItem
                data={{
                    title: "hello".repeat(100),
                    url: "hello".repeat(2),
                    desc: "aaa".repeat(200),
                    id: 1,
                    tags: Array(100).fill("tag"),
                    created_at: "2025-02-07",
                }}
                onClickEdit={() => {}}
                onClickRemove={() => {}}
                focus={false}
                colorTheme={DEFAULT_CONFIG.colorTheme}
            ></BookmarkItem>
        );

        expect(container.querySelector(".MuiCard-root")).toMatchSnapshot();
    });
});
