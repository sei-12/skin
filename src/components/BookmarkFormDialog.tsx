import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

export type BookmarkFormDialogProps = {
    colorTheme: ColorTheme;
    open: boolean;
    onClickCancel: () => void;
    onClickDone: () => void;
};

export function BookmarkFormDialog(p: BookmarkFormDialogProps) {
    return (
        <Dialog
            open={p.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: {
                    color: p.colorTheme.createNewBookmark.textColor,
                    backgroundColor: p.colorTheme.bg,
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                このページを離れますか？
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="alert-dialog-description"
                    sx={{ color: p.colorTheme.createNewBookmark.caretColor }}
                >
                    編集した内容は破棄されます
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={p.onClickCancel}>キャンセル</Button>
                <Button onClick={p.onClickDone} autoFocus>
                    ページを離れる
                </Button>
            </DialogActions>
        </Dialog>
    );
}
