import { Box, Typography } from "@mui/material";
import { forwardRef, useEffect, useRef } from "react";
import { globalColorTheme as GCT } from "../theme";
import { ZINDEX } from "../zindex";

export type SuggestionWindowProps = {
    predicate: string
    items: string[]
    focusIndex: number
}

export function SuggestionWindow(p: SuggestionWindowProps){
   
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);


	useEffect(() => {
		// フォーカスが変更されたときにスクロールする
		const focusedItem = itemRefs.current[p.focusIndex];
		if (focusedItem) {
			focusedItem.scrollIntoView({ block: "nearest"});
		}
	}, [p.focusIndex]);

    return (
        <Box
            sx={{
                display: p.items.length > 0 ? "block" : "none",
                bgcolor: GCT.suggestionWindow.bg,
                position: "absolute",
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
                    ref={(el) => (itemRefs.current[i] = el)}
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