import { Box, Typography } from "@mui/material";
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";
import { globalColorTheme as GCT } from "../lib/theme";
import { ZINDEX } from "../lib/zindex";

export type FindTagMethod = (predicate: string, inputedTags: string[]) => Promise<string[]>
export function useSuggestionWindow(
    findTagMethod: FindTagMethod,
    getInputedTags: () => string[]
) {
    const [items,setItems] = useState<string[]>([])
    const [predicate,setPredicate] = useState("")
    const [focusIndex,setFocusIndex] = useState(0)

	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const getFocusedItem = () => {
        return items.at(focusIndex)
    }
    const close = () => {
        setItems([])
        setPredicate("")
        setFocusIndex(0)
    }

    const onChangePredicateInputBox = async (e: ChangeEvent<HTMLTextAreaElement |HTMLInputElement>) => {
        let suggestionItems = await findTagMethod(e.target.value, getInputedTags())
        setItems(suggestionItems)
        setPredicate(e.target.value)
        setFocusIndex(0)
    }

	useEffect(() => {
		// フォーカスが変更されたときにスクロールする
		const focusedItem = itemRefs.current[focusIndex];
		if (focusedItem) {
			focusedItem.scrollIntoView({ block: "nearest"});
		}
	}, [focusIndex]);
    
    return {
        props: {
            items,
            predicate,
            focusIndex,
            itemRefs,
        },
        onChangePredicateInputBox,
        close,
        getFocusedItem,
        items,
        setItems,
        predicate,
        setPredicate,
        focusIndex,
        setFocusIndex,
    }
}

export function SuggestionWindow(p: ReturnType<typeof useSuggestionWindow>["props"]){
    return (
        <Box
            sx={{
                display: p.items.length > 0 ? "block" : "none",
                bgcolor: GCT.suggestionWindow.bg,
                position: "absolute",
                top: "100%",
                boxSizing: "border-box",
                zIndex: ZINDEX.popup,
                maxHeight: 400,
                width: 300,
                border: "solid 1px",
                borderColor: GCT.suggestionWindow.borderColor,
                overflow: "scroll",
                '&::-webkit-scrollbar': {
                    display: 'none', 
                },
            }}
        >
            {p.items.map((item,i) => {
                return <Item 
                    predicate={p.predicate} 
                    focus={p.focusIndex === i}
                    item={item} 
                    key={i} 
                    ref={(el) => (p.itemRefs.current[i] = el)}
                ></Item>
            })}
        </Box>
    ) 
}

type ItemProps = {
    predicate: string
    item: string
    focus: boolean
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
    (props, ref) => {
        let highlightBlocks = highlightMatchedBlocks(props.predicate,props.item)
        return (
            <Box ref={ref}
                sx={{
                    bgcolor: props.focus ? GCT.suggestionWindow.focusBg : GCT.suggestionWindow.bg,
                    padding: 0.2,
                    paddingLeft: 0.5,
                }}
            >
                {
                    highlightBlocks.map( (b,i) => {
                        return (
                            <TextBlock key={i} {...b} ></TextBlock>
                        )
                    })
                }
            </Box>
        )
    }
);

const TextBlock = (p:{
    isMatch: boolean,
    text: string
}) => {
    return (
        <Typography
            sx={{
                display: "inline",
                color: p.isMatch ? GCT.suggestionWindow.match : GCT.suggestionWindow.unmatch,
                fontWeight: "bold"
            }}
        >
            {p.text}
        </Typography>
    )
}


function highlightMatchedBlocks(predicate: string, item: string):{isMatch: boolean, text: string}[]{
    let blocks:ReturnType<typeof highlightMatchedBlocks> = []
    
    let splitedPredicate = [...predicate]
    let splitedItem = [...item]
    
    while ( splitedItem.length !== 0) {
        let i = splitedItem.shift()!
        let p = splitedPredicate[0]
        let match = i === p

        if (match){
            splitedPredicate.shift()
        }
        let lastBlock = blocks.at(-1)
        if (lastBlock === undefined){
            blocks.push({isMatch: match, text: i})
        }else{
            if ( lastBlock.isMatch === match){
                lastBlock.text += i
            }else{
                blocks.push({isMatch: match, text: i})
            }
        }
    }
    
    return blocks
}


export const __suggestion_window_test__ = {
    highlightMatchedBlocks,
    TextBlock,
    Item
}