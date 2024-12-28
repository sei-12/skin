import { CreateNewBookmark } from "../components/CreateNewBookmark";
import { Grid2 } from "@mui/material";
import { TagInputBox, useTagInputBox } from "../components/TagInputBox";
import { BookmarkList, useBookmarkList } from "../components/BookmarkList";
import { useCreateNewBookmarkPage, useSearchBookmarkPage } from "../hooks/todo";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <CreateNewBookmark {...hook.props} />;
}


export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark
        onClickAdd={hook.onClickAdd}
        tagInputBoxHook={hook.tagInputBoxHook.props}
        bkmkListHook={hook.bkmkListHook.props}
    />;
}

export function SearchBookmark(p: {
    tagInputBoxHook: ReturnType<typeof useTagInputBox>["props"];
    bkmkListHook: ReturnType<typeof useBookmarkList>["props"];
    onClickAdd: () => void;
}) {
    return (
        <Grid2
            container
            spacing={1}
            flexDirection={"column"}
            height={1}
            width={1}
        >
            <Grid2 size="auto">
                <TagInputBox {...p.tagInputBoxHook}></TagInputBox>
            </Grid2>

            <Grid2 size="grow" sx={{ overflow: "hidden", display: "flex" }}>
                <BookmarkList {...p.bkmkListHook}></BookmarkList>
            </Grid2>
        </Grid2>
    );
}
