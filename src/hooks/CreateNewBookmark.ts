import { useCallback, useEffect, useRef } from "react";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { useTagInputBox } from "./TagInputBox";
import { findTagMethod } from "../lib/findTagMethod";
import { DB } from "../lib/database";

function useCreateNewBookmark(
    onClickDone: () => void,
    onClickCancel: () => void,
    findTagMethod: FindTagMethod,
    onChangeUrl: (url: string) => void
) {
    const titleRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const tagInputBoxHook = useTagInputBox(findTagMethod);

    const setContent = (title: string, desc: string) => {
        if (titleRef.current === null) {
            return;
        }
        if (descRef.current === null) {
            return;
        }
        titleRef.current.value = title;
        descRef.current.value = desc;
    };

    const setUrl = (url: string) => {
        if (urlRef.current === null) {
            return;
        }
        urlRef.current.value = url;
        // イベントを発生させたかったけど、少し難しかった。
        onChangeUrl(url);
    };

    const getInputData = () => {
        let title = ""
        let url = ""
        let desc = ""

        if (titleRef.current !== null) {
            title = titleRef.current.value
        }
        if (urlRef.current !== null) {
            url = urlRef.current.value
        }
        if (descRef.current !== null) {
            desc = descRef.current.value
        }

        return {
            title,
            desc,
            url,
            tags: tagInputBoxHook.inputedTags.map((e) => e.text),
        };
    };

    const clearData = () => {
        if (titleRef.current === null) {
            return;
        }
        if (urlRef.current === null) {
            return;
        }
        if (descRef.current === null) {
            return;
        }

        titleRef.current.value = "";
        descRef.current.value = "";
        urlRef.current.value = "";

        tagInputBoxHook.setInputedTags([]);
    };

    return {
        props: {
            titleRef,
            descRef,
            urlRef,
            tagInputBox: tagInputBoxHook.props,
            onClickCancel,
            onClickDone,
            onChangeUrl,
        },
        tagInputBoxHook,
        setContent,
        getInputData,
        clearData,
        setUrl,
    };
}
export function useCreateNewBookmarkPage() {
    const navigate = useNavigate();

    const onClickCreateDone = () => {
        const inputData = createNewBookmarkHook.getInputData();
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
            });
    };

    const onClickCreateCancel = () => {
        createNewBookmarkHook.clearData();
        navigate("/");
    };

    // // TODO: 別のファイルに切り出してテストも書く
    const onChangeUrlInputBox = async (url: string) => {
        const content = (await invoke("fetch_website_content", { url })) as {
            title: string;
            desc: string;
        };
        const currentContent = createNewBookmarkHook.getInputData();

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
        createNewBookmarkHook.setContent(title, desc);
    };

    // todo rename
    const onKeyDownSpace = useCallback(async() => {
        const inputBox =
            createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current;
        if (inputBox === null) {
            return;
        }
        if (inputBox.value === "") {
            return;
        }
        const item = inputBox.value;

        const inputedTags = createNewBookmarkHook.getInputData().tags

        const has = inputedTags.find((t) => t == item) !== undefined;
        if (has) {
            return;
        }

        const exists = await DB.isExistsTag(item);
        createNewBookmarkHook.tagInputBoxHook.setInputedTags((ary) => {
            return [...ary, { text: item, exists }];
        });
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close();
        inputBox.value = "";
    },[]) 

    const createNewBookmarkHook = useCreateNewBookmark(
        onClickCreateDone,
        onClickCreateCancel,
        findTagMethod,
        onChangeUrlInputBox
    );

    const appHotkeyHook = useAppHotkey();

    useEffect(() => {
        if (
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items
                .length === 0
        ) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.CREATE_NEW_BOOKMARK);
        } else {
            appHotkeyHook.switchScope(
                HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW
            );
        }
    }, [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items]);

    useHotkeys(
        "Escape",
        onClickCreateCancel,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys(
        "ctrl+Enter",
        onClickCreateDone,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [createNewBookmarkHook]
    );

    useHotkeys(
        "Enter",
        createNewBookmarkHook.tagInputBoxHook.addFocusedSuggestionItem,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        "Backspace",
        createNewBookmarkHook.tagInputBoxHook.popInputedTag,
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], enableOnFormTags: true },
        []
    );


    useHotkeys(
        "Space",
        onKeyDownSpace,
        {
            scopes: [
                HOTKEY_SCOPES.CREATE_NEW_BOOKMARK,
                HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW,
            ],
            enableOnFormTags: true,
        },
        [createNewBookmarkHook]
    );
    useHotkeys(
        "ctrl+n",
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        "ctrl+p",
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    return {
        props: createNewBookmarkHook.props,
    };
}