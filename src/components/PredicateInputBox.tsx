import { Box, TextField, Typography } from "@mui/material";
import { forwardRef, useRef, useState } from "react";
import { SuggestionWindow } from "./SuggestionWindow";
import { globalColorTheme as GCT } from "../theme";

export function usePredicateInputBox() {
    const inputBoxRef = useRef<HTMLInputElement>(null)
    const [inputedTags, setInputedTags] = useState<{ text: string, exists: boolean }[]>([])

    // TODO: useSuggestionWindowを検討
    const [suggestionWindowFocusIndex, setSuggestionWindowFocusIndex] = useState(0)
    const [suggestionWindowPredicate, setSuggestionWindowPredicate] = useState("")
    const [suggestionItems, setSuggestionItems] = useState<string[]>([])
    

    return {
        inputBoxRef,

        inputedTags,
        setInputedTags,

        suggestionItems,
        setSuggestionItems,

        suggestionWindowFocusIndex,
        setSuggestionWindowFocusIndex,

        suggestionWindowPredicate,
        setSuggestionWindowPredicate,
    }
}

const ITEM_HEIGHT = 35
const TEXT_FIELD_WIDTH = 200


export type PredicateInputBoxProps = {
    inputedTags: { text: string, exists: boolean }[],
    suggestionWindowFocusIndex: number,
    suggestionWindowPredicate: string,
    suggestionItems: string[],
    onChangeInputBox: () => void
}

export const PredicateInputBox = forwardRef<HTMLInputElement, PredicateInputBoxProps>(
    (p, ref) => {
        return (
            <Box
                sx={{
                    margin: 0.5,
                    padding: 1,
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    borderRadius: 2,
                    bgcolor: GCT.predicateInputBox.bg,
                    boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.2)"
                }}
            >
                {
                    p.inputedTags.map((tag, i) => {
                        return (
                            <TagItem
                                key={i}
                                {...tag}
                            ></TagItem>
                        )
                    })
                }
                <Box
                    sx={{
                        height: ITEM_HEIGHT,
                        width: TEXT_FIELD_WIDTH,
                        position: "relative",
                    }}
                >
                    <TextField
                        onInput={() => { p.onChangeInputBox() }}
                        inputRef={ref}
                        variant="outlined"
                        size="medium"
                        sx={{
                            width: TEXT_FIELD_WIDTH,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                            position: "absolute",
                            // https://github.com/mui/material-ui/issues/30379
                            '& fieldset': { border: "none" },
                        }}
                        placeholder="/"
                    ></TextField>
                    <SuggestionWindow
                        focusIndex={p.suggestionWindowFocusIndex}
                        predicate={p.suggestionWindowPredicate}
                        items={p.suggestionItems}
                    ></SuggestionWindow>
                </Box>
            </Box>
        )
    }
)
function TagItem(p: { text: string, exists: boolean }) {
    return (
        <Box
            sx={{
                bgcolor: GCT.tagItem.bg,
                color: p.exists ? GCT.tagItem.exists : GCT.tagItem.notExists,
                display: "flex",
                height: ITEM_HEIGHT,
                minWidth: 60,
                maxWidth: 300,
                padding: 0.5,
                paddingInline: 1.5,
                borderRadius: 2,
                borderStyle: "solid",
                borderWidth: 2,
                borderColor: GCT.tagItem.bordercolor,
            }}
        >
            <Typography
                sx={{
                    margin: "auto",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >{p.text}</Typography>
        </Box>
    )
}