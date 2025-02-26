import { useCallback, useState } from "react";
import type { BookmarkFormDialogProps } from "../components/BookmarkFormDialog";
import { useConfig } from "../providers/configProvider";

export function useBookmarkFormDialog(onClickDone: () => void) {
    const [open, setOpen] = useState(false);

    const onClickCancel = useCallback(() => {
        setOpen(false);
    }, []);
    const onClickDone_ = useCallback(() => {
        setOpen(false);
        onClickDone();
    }, []);

    const { colorTheme } = useConfig();
    const props: BookmarkFormDialogProps = {
        colorTheme,
        onClickCancel,
        onClickDone: onClickDone_,
        open,
    };
    return {
        props,
        setOpen,
    };
}
