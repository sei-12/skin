import { Stack } from "@mui/material"
import { IData } from "../data"
import { useEffect, useRef } from "react"
import { BookmarkItem } from "./BookmarkItem"

type BookmarkListProps = {
	onClickRemove: (key: string) => void
	onClickEdit: (key: string) => void
	items: IData.Bookmark[]
    focusIndex: number
}


export function BookmarkList(props: BookmarkListProps){

	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		// フォーカスが変更されたときにスクロールする
		const focusedItem = itemRefs.current[props.focusIndex];
		if (focusedItem) {
			focusedItem.scrollIntoView({ block: "nearest"});
		}
	}, [props.focusIndex]);

    return (
        <Stack 
            spacing={1}
            sx={{
                overflow: "scroll",
                '&::-webkit-scrollbar': {
                    display: 'none', 
                },
                flexGrow: 1,
            }}
        >
            {
                props.items.map( (item,i) => {
                    return <BookmarkItem 
						ref={(el) => (itemRefs.current[i] = el)}
                        data={item}
                        focus={props.focusIndex === i}                        
                        key={item.key}
                        onClickEdit={props.onClickEdit}
                        onClickRemove={props.onClickRemove}
                    ></BookmarkItem>
                })                
            }
        </Stack>
    )
}