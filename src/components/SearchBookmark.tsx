import { Grid2 } from "@mui/material";
import type { TagInputBoxProps } from "../components/TagInputBox";
import { TagInputBox } from "../components/TagInputBox";
import type { BookmarkListProps } from "../components/BookmarkList";
import { BookmarkList } from "../components/BookmarkList";

export type SearchBookmarkProps = {
    tagInputBoxProps: TagInputBoxProps;
    bkmkListProps: BookmarkListProps;
    onClickAdd: () => void;
};

export function SearchBookmark(p: SearchBookmarkProps) {
    return (
        <Grid2
            data-testid="search-bookmark"
            container
            spacing={1}
            flexDirection={"column"}
            height={1}
            width={1}
        >
            <Grid2 size="auto">
                <TagInputBox {...p.tagInputBoxProps}></TagInputBox>
            </Grid2>

            <Grid2 size="grow" sx={{ overflow: "hidden", display: "flex" }}>
                <BookmarkList {...p.bkmkListProps}></BookmarkList>
            </Grid2>
        </Grid2>
    );
}
