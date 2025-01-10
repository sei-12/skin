import { useCallback, useEffect, useRef } from "react";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { HOTKEY_SCOPES, useAppHotkey } from "./hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { useTagInputBox } from "./TagInputBox";
import { findTagMethod } from "../services/findTagMethod";
import { DB } from "../services/database";
import { useConfig } from "../providers/configProvider";
import { isUrl } from "../vanilla/isUrl";
import { ClipBoardManager } from "../services/clipboard";
import type { CreateNewBookmarkProps } from "../components/CreateNewBookmark";

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

    const autoInputUrl = useCallback(async () => {
        const clipboardText = await ClipBoardManager.read()
        if (!isUrl(clipboardText)) {
            return;
        }
        setUrl(clipboardText)
    }, [])

    useEffect(() => {
        autoInputUrl()
    }, [])

    const getInputData = useCallback(() => {
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
    }, [tagInputBoxHook.inputedTags]);

    const onKeyDownBackspace = useCallback(() => {
        const hasFocus = tagInputBoxHook.inputBoxRef.current == document.activeElement
        if (!hasFocus) { return }
        tagInputBoxHook.popInputedTag()
    }, [tagInputBoxHook])

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

    const { colorTheme } = useConfig()
    const props: CreateNewBookmarkProps = {
        titleRef,
        descRef,
        urlRef,
        tagInputBox: tagInputBoxHook.props,
        onClickCancel,
        onClickDone,
        onChangeUrl,
        colorTheme,
    }

    return {
        props,
        tagInputBoxHook,
        onKeyDownBackspace,
        setContent,
        getInputData,
        clearData,
        setUrl,
    };
}
export function useCreateNewBookmarkPage() {
    const navigate = useNavigate();
    const { keybinds } = useConfig()

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

    const createNewBookmarkHook = useCreateNewBookmark(
        onClickCreateDone,
        onClickCreateCancel,
        findTagMethod,
        onChangeUrlInputBox
    );

    const takeInputTag = useCallback(async () => {
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
            inputBox.value = ""
            return;
        }

        const exists = await DB.isExistsTag(item);
        createNewBookmarkHook.tagInputBoxHook.setInputedTags((ary) => {
            return [...ary, { text: item, exists }];
        });
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close();
        inputBox.value = "";
    }, [createNewBookmarkHook.getInputData])

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
        keybinds.cancelCreateNewBookmark,
        onClickCreateCancel,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.doneCreateNewBookmark,
        onClickCreateDone,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.addFocusedSuggestionItem,
        createNewBookmarkHook.tagInputBoxHook.addFocusedSuggestionItem,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.popInputedTag,
        createNewBookmarkHook.onKeyDownBackspace,
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], enableOnFormTags: true },
    );


    useHotkeys("/", createNewBookmarkHook.tagInputBoxHook.focusPredicateInputBox,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
        }
    )

    useHotkeys(
        keybinds.takeInputTag,
        takeInputTag,
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
        keybinds.focusDownSuggestionWindow,
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.focusUpSuggestionWindow,
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