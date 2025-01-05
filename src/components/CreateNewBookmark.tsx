import { Button, TextField } from "@mui/material";
import type { TagInputBoxProps } from "./TagInputBox";
import { TagInputBox } from "./TagInputBox";

export type CreateNewBookmarkProps = {
    titleRef: React.RefObject<HTMLInputElement>;
    descRef: React.RefObject<HTMLInputElement>;
    urlRef: React.RefObject<HTMLInputElement>;
    onClickCancel: () => void;
    onClickDone: () => void;
    onChangeUrl: (url: string) => void;

    tagInputBox: TagInputBoxProps
};

export function CreateNewBookmark(p: CreateNewBookmarkProps) {
    return (
        <div data-testid="create-new-bookmark">
            <TextField
                inputRef={p.urlRef}
                sx={{ width: 0.8 }}
                placeholder={"url"}
                onChange={(e) => {
                    p.onChangeUrl(e.target.value);
                }}
            />
            <TextField
                inputRef={p.titleRef}
                sx={{
                    width: 0.8,
                }}
                placeholder={"title"}
            />
            <TagInputBox {...p.tagInputBox} />
            <TextField
                inputRef={p.descRef}
                sx={{
                    width: 1,
                }}
                placeholder={"desc"}
            />
            <Button onClick={p.onClickCancel}>Cancel</Button>
            <Button onClick={p.onClickDone}>Done</Button>
        </div>
    );
}
