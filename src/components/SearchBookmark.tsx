import { Button, Grid2 } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { TagInputBoxProps } from "../components/TagInputBox";
import { TagInputBox } from "../components/TagInputBox";
import type { BookmarkListProps } from "../components/BookmarkList";
import { BookmarkList } from "../components/BookmarkList";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

export type SearchBookmarkProps = {
    tagInputBoxProps: TagInputBoxProps;
    bkmkListProps: BookmarkListProps;
    colorTheme: ColorTheme;
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
                <Grid2 container spacing={2}>
                    <Grid2 size="grow">
                        <TagInputBox {...p.tagInputBoxProps}></TagInputBox>
                    </Grid2>
                    <Grid2 size="auto">
                        <Button
                            variant="contained"
                            data-testid="add-button"
                            onClick={p.onClickAdd}
                            sx={{
                                marginBlock: "3px",
                                minWidth: "45px",
                                minHeight: "45px",
                                padding: 0,
                                bgcolor: p.colorTheme.addButton.bgColor,
                                
                                borderStyle: "solid",
                                borderWidth: 2,
                                borderColor: p.colorTheme.addButton.borderColor,
                                color: p.colorTheme.addButton.color,
                                
                                borderRadius: 2,
                            }}
                        >
                            <AddIcon></AddIcon>
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2 size="grow" sx={{ overflow: "hidden", display: "flex" }}>
                <BookmarkList {...p.bkmkListProps}></BookmarkList>
            </Grid2>
        </Grid2>
    );
}
