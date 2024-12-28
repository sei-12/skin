import { Grid2 } from "@mui/material";
import { TagInputBox, TagInputBoxProps } from "../components/TagInputBox";
import { BookmarkList, BookmarkListProps } from "../components/BookmarkList";

export type SearchBookmarkProps = {
    tagInputBoxProps: TagInputBoxProps;
    bkmkListProps: BookmarkListProps;
    onClickAdd: () => void;
};

export function SearchBookmark(p: SearchBookmarkProps) {
    return (
        <Grid2
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
