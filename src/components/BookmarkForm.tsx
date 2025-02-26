import { Box, Button, TextField } from "@mui/material";
import type { TagInputBoxProps } from "./TagInputBox";
import { TagInputBox } from "./TagInputBox";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";
import type { BookmarkFormDialogProps } from "./BookmarkFormDialog";
import { BookmarkFormDialog } from "./BookmarkFormDialog";

export type BookmarkFormProps = {
    titleRef: React.RefObject<HTMLInputElement>;
    descRef: React.RefObject<HTMLInputElement>;
    urlRef: React.RefObject<HTMLInputElement>;
    onClickCancel: () => void;
    onClickDone: () => void;
    onChangeUrl: (url: string) => void;

    dialog: BookmarkFormDialogProps;
    colorTheme: ColorTheme;
    tagInputBox: TagInputBoxProps;
};

export function BookmarkForm(p: BookmarkFormProps) {
    const inputStyle = {
        input: {
            style: {
                color: p.colorTheme.createNewBookmark.textColor,
                caretColor: p.colorTheme.createNewBookmark.caretColor,
            },
        },
    };

    return (
        <Box
            data-testid="create-new-bookmark"
            sx={{
                padding: 2,
            }}
        >
            <BookmarkFormDialog {...p.dialog}></BookmarkFormDialog>
            <TextField
                slotProps={inputStyle}
                inputRef={p.urlRef}
                sx={{
                    width: 1,
                    marginBlock: 0.5,
                    boxSizing: "border-box",
                    "::placeholder": {
                        color: p.colorTheme.predicateInputBox.placeholder,
                    },
                }}
                placeholder={"url"}
                onChange={(e) => {
                    p.onChangeUrl(e.target.value);
                }}
            />
            <TextField
                slotProps={inputStyle}
                inputRef={p.titleRef}
                sx={{
                    width: 1,
                    marginBlock: 0.5,
                    boxSizing: "border-box",
                    "::placeholder": {
                        color: p.colorTheme.predicateInputBox.placeholder,
                    },
                }}
                placeholder={"title"}
            />
            <TagInputBox {...p.tagInputBox} />
            <TextField
                slotProps={inputStyle}
                inputRef={p.descRef}
                multiline={true}
                rows={4}
                sx={{
                    width: 1,
                    marginBlock: 0.5,
                    boxSizing: "border-box",
                    "::placeholder": {
                        color: p.colorTheme.predicateInputBox.placeholder,
                    },
                }}
                placeholder={"desc"}
            />
            <Button onClick={p.onClickCancel}>Cancel</Button>
            <Button onClick={p.onClickDone}>Done</Button>
        </Box>
    );
}
