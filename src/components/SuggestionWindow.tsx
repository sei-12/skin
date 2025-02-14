import { Box, Typography } from "@mui/material";
import { ZINDEX } from "../vanilla/zindex";
import { forwardRef } from "react";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

export type FindTagMethod = (
    predicate: string,
    inputedTags: string[]
) => Promise<[string, boolean][][]>;

export type SuggestionWindowProps = {
    items: [string, boolean][][];
    focusIndex: number;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    colorTheme: ColorTheme;
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
    item: [string, boolean][];
    focus: boolean;
    colorTheme: ColorTheme;
};

export const SuggestionWindowItem = forwardRef<HTMLDivElement, ItemProps>(
    (p, ref) => {
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
                {p.item.map((b, i) => {
                    return (
                        <SuggestionWindowItemTextBlock
                            key={i}
                            isMatch={b[1]}
                            text={b[0]}
                            colorTheme={p.colorTheme}
                        ></SuggestionWindowItemTextBlock>
                    );
                })}
            </Box>
        );
    }
);

export const SuggestionWindowItemTextBlock = (p: {
    isMatch: boolean;
    text: string;
    colorTheme: ColorTheme;
}) => {
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
