import { useEffect } from "react";
import type { BookmarkFormProps } from "../components/BookmarkForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookmarkForm } from "./BookmarkForm";
import { findTagMethod } from "../services/findTagMethod";
import { DB } from "../services/database";

interface State {
    bookmarkId: number
}

export function useEditBookmarkPage(): BookmarkFormProps {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookmarkId } = location.state as State;

    const onClickDone = async () => {
        const inputedData = bookmarkFormHook.getInputData()
        await DB.editBookmark(
            bookmarkId,
            inputedData.title,
            inputedData.url,
            inputedData.desc,
            inputedData.tags
        )
        goRoot()
    }

    const goRoot = () => {
        navigate("/");
        bookmarkFormHook.clearData();
    };

    const bookmarkFormHook = useBookmarkForm(
        onClickDone,
        goRoot,
        findTagMethod,
        () => { }
    )

    const loadBookmarkData = async () => {
        const bkmk = await DB.getBookmark(bookmarkId)
        bookmarkFormHook.setContent(bkmk.title, bkmk.desc, bkmk.tags)
        bookmarkFormHook.setUrl(bkmk.url)
    }

    useEffect(() => {
        loadBookmarkData()
    }, [])

    return bookmarkFormHook.props
}