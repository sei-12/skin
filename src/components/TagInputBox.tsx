import { Box, TextField, Typography } from "@mui/material";
import type { SuggestionWindowProps } from "./SuggestionWindow";
import { SuggestionWindow } from "./SuggestionWindow";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

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
    colorTheme: ColorTheme
};

export const TagInputBox = (p: TagInputBoxProps) => {
    return (
        <Box
            data-testid="taginputbox-root"
            sx={{
                padding: 1,
                position: "relative",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                borderRadius: 2,
                bgcolor: p.colorTheme.predicateInputBox.bg,
                boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.2)",
            }}
        >
            {p.inputedTags.map((tag, i) => {
                return <TagItem key={i} {...tag} colorTheme={p.colorTheme}></TagItem>;
            })}
            <Box
                sx={{
                    height: ITEM_HEIGHT,
                    width: TEXT_FIELD_WIDTH,
                    position: "relative",
                    // color: p.colorTheme.predicateInputBox.textColor,
                    
                    color: "white"
                }}
            >
                <TextField
                    slotProps={{
                        input: {
                            style: {
                                color: p.colorTheme.predicateInputBox.textColor,
                                caretColor: p.colorTheme.predicateInputBox.caretColor,
                            }
                        }
                    }}

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
                        "::placeholder": {
                            color: p.colorTheme.predicateInputBox.placeholder,
                        }
                    }}
                    placeholder="/"
                ></TextField>
                <SuggestionWindow {...p.swProps}></SuggestionWindow>
            </Box>
        </Box>
    );
};

function TagItem(p: { text: string; exists: boolean, colorTheme: ColorTheme }) {
    return (
        <Box
            data-testid="taginputbox-tagitem"
            sx={{
                bgcolor: p.colorTheme.tagItem.bg,
                color: p.exists ? p.colorTheme.tagItem.exists : p.colorTheme.tagItem.notExists,
                display: "flex",
                height: ITEM_HEIGHT,
                minWidth: 60,
                maxWidth: 300,
                padding: 0.5,
                paddingInline: 1.5,
                borderRadius: 2,
                borderStyle: "solid",
                borderWidth: 2,
                borderColor: p.colorTheme.tagItem.borderColor,
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
