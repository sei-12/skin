import { Stack } from "@mui/material"
import { IData } from "../dts/data"
import { useEffect, useRef, useState } from "react"
import { BookmarkItem } from "./BookmarkItem"

export function useBookmarkList(
	onClickRemove: (key: number) => void,
	onClickEdit: (key: number) => void,
){
    const [items, setItems] = useState<IData.Bookmark[]>([])
    const [focusIndex, setFocusIndex] = useState(0)
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    
	useEffect(() => {
		// フォーカスが変更されたときにスクロールする
		const focusedItem = itemRefs.current[focusIndex];
		if (focusedItem) {
			focusedItem.scrollIntoView({ block: "nearest"});
		}
	}, [focusIndex]);

    return {
        items,
        setItems,
        focusIndex,
        setFocusIndex,
        
        props: {
            onClickEdit,
            onClickRemove,
            itemRefs,
            focusIndex,
            items,
        }
    }
}

export function BookmarkList(props: ReturnType<typeof useBookmarkList>["props"]){
    return (
        <Stack 
            spacing={1}
            sx={{
                overflow: "scroll",
                '&::-webkit-scrollbar': {
                    display: 'none', 
                },
                flexGrow: 1,
                padding: 0.5
            }}
        >
            {
                props.items.map( (item,i) => {
                    return <BookmarkItem 
						ref={(el) => (props.itemRefs.current[i] = el)}
                        data={item}
                        focus={props.focusIndex === i}                        
                        key={item.id}
                        onClickEdit={props.onClickEdit}
                        onClickRemove={props.onClickRemove}
                    ></BookmarkItem>
                })                
            }
        </Stack>
    )
}