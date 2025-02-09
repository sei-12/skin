import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { findTagMethod } from "../services/findTagMethod";
import { DB } from "../services/database";
import { isUrl } from "../vanilla/isUrl";
import { ClipBoardManager } from "../services/clipboard";
import { useBookmarkForm } from "./BookmarkForm";
import { useNotice } from "../providers/NoticeProvider";


export function useCreateNewBookmarkPage() {
    const navigate = useNavigate();
    const { addNotice } = useNotice()

    const onClickCreateDone = () => {
        const inputData = bookmarkFormHook.getInputData();
        if (inputData === undefined) {
            return;
        }

        DB
            .insertBookmark(
                inputData.title,
                inputData.url,
                inputData.desc,
                inputData.tags
            )
            .then(() => {
                onClickCreateCancel();
                addNotice({
                    message: "SUCCESS!",
                    serverity: "success"
                })
            })
            .catch(() => {
                addNotice({
                    message: "ERROR!",
                    serverity: "error"
                })
            });
    };

    const onClickCreateCancel = () => {
        bookmarkFormHook.clearData();
        navigate("/");
    };

    const onChangeUrlInputBox = async (url: string) => {
        const content = (await invoke("fetch_website_content", { url })) as {
            title: string;
            desc: string;
        };
        const currentContent = bookmarkFormHook.getInputData();

        const setData = (cur: string | undefined, newContent: string | null) => {
            if (cur !== undefined && cur !== "") {
                return cur;
            }

            if (newContent !== null) {
                return newContent;
            }

            return "";
        };

        const title = setData(currentContent?.title, content.title);
        const desc = setData(currentContent?.desc, content.desc);
        const tags = bookmarkFormHook.getInputData().tags;

        bookmarkFormHook.setContent(title, desc, tags);
    };

    const bookmarkFormHook = useBookmarkForm(
        onClickCreateDone,
        onClickCreateCancel,
        findTagMethod,
        onChangeUrlInputBox
    );

    const autoInputUrl = useCallback(async () => {
        const clipboardText = await ClipBoardManager.read()
        if (!isUrl(clipboardText)) {
            return;
        }
        bookmarkFormHook.setUrl(clipboardText)
    }, [])

    useEffect(() => {
        autoInputUrl()
    }, [])

    return bookmarkFormHook.props
}