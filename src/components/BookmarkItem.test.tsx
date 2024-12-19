import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { BookmarkItem, BookmarkItemProps } from "./BookmarkItem";
import { IData } from "../dts/data";

// Mock globalColorTheme
vi.mock("../lib/theme", () => ({
    globalColorTheme: {
        bookmarkItem: {
            focusBg: "#f0f0f0",
            bg: "#ffffff",
            title: "#000000",
            desc: "#666666",
            tag: "#888888",
        },
    },
}));

describe("BookmarkItem", () => {
    const mockData: IData.Bookmark = {
        id: 1,
        url: "aaa",
        title: "Sample Bookmark",
        desc: "This is a sample description for the bookmark item.",
        tags: ["tag1", "tag2", "tag3"],
    };

    const defaultProps: BookmarkItemProps = {
        data: mockData,
        onClickRemove: vi.fn(),
        onClickEdit: vi.fn(),
        focus: false,
    };

    it("renders the title, description, and tags", () => {
        render(<BookmarkItem {...defaultProps} />);

        // expect(screen.getByText("Sample Bookmark")).toBeInTheDocument();
        expect(screen.getByText("Sample Bookmark")).toBeVisible();
        expect(screen.getByText("This is a sample description for the bookmark item.")).toBeInTheDocument();
        expect(screen.getByText("#tag1")).toBeInTheDocument();
        expect(screen.getByText("#tag2")).toBeInTheDocument();
        expect(screen.getByText("#tag3")).toBeInTheDocument();
    });

    it("applies the correct background color when focused", () => {
        const { container, rerender } = render(<BookmarkItem {...defaultProps} focus={true} />);

        expect(container.querySelector(".MuiCard-root")).toHaveStyle("background-color: #f0f0f0");

        rerender(<BookmarkItem {...defaultProps} focus={false} />);

        expect(container.querySelector(".MuiCard-root")).toHaveStyle("background-color: #ffffff");
    });

    it("calls the correct functions on click actions", async () => {
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


        // Simulate clicks
        // Replace these with actual buttons or clickable elements if present in your BookmarkItem
        
        await user.click(screen.getAllByRole('button')[0]); // どう書いたらいいかわからんかった
        await user.click(screen.getAllByRole('button')[1]);


        // Uncomment and replace with appropriate selectors if implemented
        expect(handleClickRemove).toHaveBeenCalledOnce();
        expect(handleClickEdit).toHaveBeenCalledOnce();
    });

    it("tag style", async () => {
        render(<BookmarkItem {...defaultProps} />);
        const tag = screen.getByText("#tag1");
        expect(tag).toHaveStyle("color: #888888");
    });
    
    it("snapshot",() => {
        const { container } = render(<BookmarkItem
               data={{
                title: "hello".repeat(100),
                url: "hello".repeat(2),
                desc: "aaa".repeat(200),
                id: 1,
                tags: Array(100).fill("tag")
               }}
               onClickEdit={() => {}}
               onClickRemove={() => {}}
               focus={false}
        ></BookmarkItem>)
        
        expect(container.querySelector(".MuiCard-root")).toMatchSnapshot()
    })
});