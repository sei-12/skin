import { Box, TextField, Typography } from "@mui/material";
import type { SuggestionWindowProps } from "./SuggestionWindow";
import { SuggestionWindow } from "./SuggestionWindow";
import { globalColorTheme as GCT } from "../lib/theme";

const ITEM_HEIGHT = 35;
const TEXT_FIELD_WIDTH = 200;

export type TagInputBoxProps = {
    swProps: SuggestionWindowProps;
    inputBoxRef: React.RefObject<HTMLInputElement>;
    inputedTags: {
        text: string;
        exists: boolean;
    }[];
    onChangePredicateInputBox: ( targetVal: string) => Promise<void>;
};

export const TagInputBox = (p: TagInputBoxProps) => {
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
                boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.2)",
            }}
        >
            {p.inputedTags.map((tag, i) => {
                return <TagItem key={i} {...tag}></TagItem>;
            })}
            <Box
                sx={{
                    height: ITEM_HEIGHT,
                    width: TEXT_FIELD_WIDTH,
                    position: "relative",
                }}
            >
                <TextField
                    data-testid="taginputbox-predicateinputbox"
                    onChange={(e) => {
                        p.onChangePredicateInputBox(e.target.value);
                    }}
                    inputRef={p.inputBoxRef}
                    autoComplete="off"
                    variant="outlined"
                    size="medium"
                    sx={{
                        width: TEXT_FIELD_WIDTH,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        position: "absolute",
                        // https://github.com/mui/material-ui/issues/30379
                        "& fieldset": { border: "none" },
                    }}
                    placeholder="/"
                ></TextField>
                <SuggestionWindow {...p.swProps}></SuggestionWindow>
            </Box>
        </Box>
    );
};

function TagItem(p: { text: string; exists: boolean }) {
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
            >
                {p.text}
            </Typography>
        </Box>
    );
}
