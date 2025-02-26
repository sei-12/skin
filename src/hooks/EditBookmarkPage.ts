import { useEffect } from "react";
import type { BookmarkFormProps } from "../components/BookmarkForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookmarkForm } from "./BookmarkForm";
import { findTagMethod } from "../services/findTagMethod";
import { DB } from "../services/database";
import { useNotice } from "../providers/NoticeProvider";
import { useBookmarkFormDialog } from "./BookmarkFormDialog";

interface State {
    bookmarkId: number;
}

export function useEditBookmarkPage(): BookmarkFormProps {
    const navigate = useNavigate();
    const { addNotice } = useNotice();
    const location = useLocation();
    const { bookmarkId } = location.state as State;

    const onClickDone = async () => {
        const inputedData = bookmarkFormHook.getInputData();
        const success = await DB.editBookmark(
            bookmarkId,
            inputedData.title,
            inputedData.url,
            inputedData.desc,
            inputedData.tags,
        )
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });

        if (success) {
            addNotice({
                message: "SUCCESS!",
                serverity: "success",
            });
            navigate("/");
            bookmarkFormHook.clearData();
        } else {
            addNotice({
                message: "ERROR!",
                serverity: "error",
            });
        }
    };

    const dialogProps = useBookmarkFormDialog(() => {
        bookmarkFormHook.clearData();
        navigate("/");
    });

    const onClickCancel = () => {
        dialogProps.setOpen(true);
    };

    const bookmarkFormHook = useBookmarkForm(
        onClickDone,
        onClickCancel,
        dialogProps.props,
        findTagMethod,
        () => {},
    );

    const loadBookmarkData = async () => {
        const bkmk = await DB.getBookmark(bookmarkId);
        bookmarkFormHook.setContent(bkmk.title, bkmk.desc, bkmk.tags);
        bookmarkFormHook.setUrl(bkmk.url);
    };

    useEffect(() => {
        loadBookmarkData();
    }, []);

    return bookmarkFormHook.props;
}
