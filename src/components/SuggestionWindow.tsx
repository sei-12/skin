import { Box, Typography } from "@mui/material";
import { globalColorTheme as GCT } from "../lib/theme";
import { ZINDEX } from "../lib/zindex";
import { forwardRef } from "react";

export type FindTagMethod = (
    predicate: string,
    inputedTags: string[]
) => Promise<string[]>;


export type SuggestionWindowProps = {
    items: string[];
    predicate: string;
    focusIndex: number;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

export function SuggestionWindow(p: SuggestionWindowProps) {
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
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
        >
            {p.items.map((item, i) => {
                return (
                    <SuggestionWindowItem
                        predicate={p.predicate}
                        focus={p.focusIndex === i}
                        item={item}
                        key={i}
                        ref={(el) => (p.itemRefs.current[i] = el)}
                    ></SuggestionWindowItem>
                );
            })}
        </Box>
    );
}

type ItemProps = {
    predicate: string;
    item: string;
    focus: boolean;
};

export const SuggestionWindowItem = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
    const highlightBlocks = highlightMatchedBlocks(props.predicate, props.item);
    return (
        <Box
            ref={ref}
            sx={{
                bgcolor: props.focus
                    ? GCT.suggestionWindow.focusBg
                    : GCT.suggestionWindow.bg,
                padding: 0.2,
                paddingLeft: 0.5,
            }}
        >
            {highlightBlocks.map((b, i) => {
                return <SuggestionWindowItemTextBlock key={i} {...b}></SuggestionWindowItemTextBlock>;
            })}
        </Box>
    );
});

export const SuggestionWindowItemTextBlock = (p: { isMatch: boolean; text: string }) => {
    return (
        <Typography
            sx={{
                display: "inline",
                color: p.isMatch
                    ? GCT.suggestionWindow.match
                    : GCT.suggestionWindow.unmatch,
                fontWeight: "bold",
            }}
        >
            {p.text}
        </Typography>
    );
};

function highlightMatchedBlocks(
    predicate: string,
    item: string
): { isMatch: boolean; text: string }[] {
    const blocks: ReturnType<typeof highlightMatchedBlocks> = [];

    const splitedPredicate = [...predicate];
    const splitedItem = [...item];

    while (splitedItem.length !== 0) {
        const i = splitedItem.shift()!;
        const p = splitedPredicate[0];
        const match = i === p;

        if (match) {
            splitedPredicate.shift();
        }
        const lastBlock = blocks.at(-1);
        if (lastBlock === undefined) {
            blocks.push({ isMatch: match, text: i });
        } else {
            if (lastBlock.isMatch === match) {
                lastBlock.text += i;
            } else {
                blocks.push({ isMatch: match, text: i });
            }
        }
    }

    return blocks;
}
