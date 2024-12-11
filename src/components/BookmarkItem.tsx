import { forwardRef } from "react"
import { IData } from "../data"
import { Card, CardContent, Stack, Typography } from "@mui/material"
import { globalColorTheme as GCT } from "../theme"

export type BookmarkItemProps = {
    data: IData.Bookmark

    onClickRemove: (key:string) => void
    onClickEdit: (key:string) => void
    focus: boolean
}

export const BookmarkItem = forwardRef<HTMLDivElement, BookmarkItemProps>(
	(props, ref) => {
		return (
            <div ref={ref}>
                <Card variant="elevation" sx={{ 
                    bgcolor: props.focus ? GCT.bookmarkItem.focusBg : GCT.bookmarkItem.bg,
                    borderRadius: 2.5,
                }}>
                    <CardContent>
                        <Typography variant="h5" sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            color: GCT.bookmarkItem.title,
                            fontWeight: "bold"
                        }}>{props.data.title}</Typography>
                        <Stack spacing={0.7} direction={"row"} sx={{overflow: "hidden"}}>
                            {props.data.tags.map((t, i) => <TagItem key={i} text={t}></TagItem>)}
                        </Stack>
                        <Typography
                            sx={{ 
                                color: GCT.bookmarkItem.desc,
                                fontWeight: 100,
                                overflow: "hidden",
                                display: "-webkit-box",
                                wordBreak: 'break-all' ,
                                lineClamp: 3, 
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                            }}
                        >{props.data.desc}</Typography>
                    </CardContent>
                </Card>
            </div>
		);
	}
);

function TagItem(props: {text: string}){
    return (
        <Typography
            sx={{
                color: GCT.bookmarkItem.tag,
                ":hover":{
                    color: GCT.bookmarkItem.tagHover
                }
            }}
        >#{props.text}</Typography>
    )
}
