import { Box, Typography } from "@mui/material";
import { ZINDEX } from "../vanilla/zindex";
import { forwardRef } from "react";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

export type FindTagMethod = (
    predicate: string,
    inputedTags: string[]
) => Promise<string[]>;


export type SuggestionWindowProps = {
    items: string[];
    predicate: string;
    focusIndex: number;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    colorTheme: ColorTheme
};

export function SuggestionWindow(p: SuggestionWindowProps) {
    return (
        <Box
            data-testid="suggestion-window"
            sx={{
                display: p.items.length > 0 ? "block" : "none",
                bgcolor: p.colorTheme.suggestionWindow.bg,
                position: "absolute",
                top: "100%",
                boxSizing: "border-box",
                zIndex: ZINDEX.popup,
                maxHeight: 400,
                width: 300,
                border: "solid 1px",
                borderColor: p.colorTheme.suggestionWindow.borderColor,
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
                        colorTheme={p.colorTheme}
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
    colorTheme: ColorTheme
};

export const SuggestionWindowItem = forwardRef<HTMLDivElement, ItemProps>((p, ref) => {
    const highlightBlocks = highlightMatchedBlocks(p.predicate, p.item);
    return (
        <Box
            data-testid="suggestion-item"
            ref={ref}
            sx={{
                bgcolor: p.focus
                    ? p.colorTheme.suggestionWindow.focusBg
                    : p.colorTheme.suggestionWindow.bg,
                padding: 0.2,
                paddingLeft: 0.5,
            }}
        >
            {highlightBlocks.map((b, i) => {
                return <SuggestionWindowItemTextBlock key={i} {...b} colorTheme={p.colorTheme}></SuggestionWindowItemTextBlock>;
            })}
        </Box>
    );
});

export const SuggestionWindowItemTextBlock = (p: { isMatch: boolean; text: string , colorTheme: ColorTheme}) => {
    return (
        <Typography
            sx={{
                display: "inline",
                color: p.isMatch
                    ? p.colorTheme.suggestionWindow.match
                    : p.colorTheme.suggestionWindow.unmatch,
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
