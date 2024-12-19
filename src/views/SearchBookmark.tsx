import { Button, Grid2 } from "@mui/material";
import { TagInputBox, useTagInputBox } from "../components/TagInputBox";
import { BookmarkList, useBookmarkList } from "../components/BookmarkList";
import { AddBox } from "@mui/icons-material";



export function SearchBookmark(p: {
    tagInputBoxHook: ReturnType<typeof useTagInputBox>["props"],
    bkmkListHook: ReturnType<typeof useBookmarkList>["props"],
	onClickAdd:() => void,
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
				<Button>
					<AddBox onClick={p.onClickAdd}/>
				</Button>
                <TagInputBox {...p.tagInputBoxHook} ></TagInputBox>
            </Grid2>

            <Grid2
                size="grow"
                sx={{ overflow: "hidden", display: "flex" }}
            >
                <BookmarkList {...p.bkmkListHook}></BookmarkList>
            </Grid2>
        </Grid2>
    )
}
