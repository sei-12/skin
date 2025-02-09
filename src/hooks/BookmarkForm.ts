import { useCallback, useEffect, useRef } from "react";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { HOTKEY_SCOPES, useAppHotkey } from "./hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { useTagInputBox } from "./TagInputBox";
import { DB } from "../services/database";
import { useConfig } from "../providers/configProvider";
import type { BookmarkFormProps } from "../components/BookmarkForm";
import { useNotice } from "../providers/NoticeProvider";

export function useBookmarkForm(
    onClickDone: () => void,
    onClickCancel: () => void,
    findTagMethod: FindTagMethod,
    onChangeUrl: (url: string) => void
) {
    const titleRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const { addNotice } = useNotice()

    const tagInputBoxHook = useTagInputBox(findTagMethod);

    const setContent = async (title: string, desc: string, tags: string[]) => {
        if (titleRef.current === null) {
            return;
        }
        if (descRef.current === null) {
            return;
        }
        titleRef.current.value = title;
        descRef.current.value = desc;

        const inputedTags = await Promise.all(
            tags.map(t => DB.isExistsTag(t)
                .then(a => ({ text: t, exists: a }))
                .catch(() => {
                    addNotice({
                        message: "ERROR!",
                        serverity: "error"
                    })
                    return { text: "ERROR", exists: false }
                })
            )
        )
        tagInputBoxHook.setInputedTags(inputedTags)
    };

    const setUrl = (url: string) => {
        if (urlRef.current === null) {
            return;
        }
        urlRef.current.value = url;
        // イベントを発生させたかったけど、少し難しかった。
        onChangeUrl(url);
    };

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

    const takeInputTag = useCallback(async () => {
        const inputBox =
            tagInputBoxHook.inputBoxRef.current;
        if (inputBox === null) {
            return;
        }

        const item = inputBox.value.replace(/ /g, "");

        if (item === "") {
            return;
        }

        const inputedTags = tagInputBoxHook.inputedTags.map(e => e.text)

        const has = inputedTags.find((t) => t == item) !== undefined;
        if (has) {
            inputBox.value = ""
            return;
        }

        const exists = await DB.isExistsTag(item).catch(() => {
            addNotice({
                message: "ERROR!",
                serverity: "error"
            })
            return false;
        });

        tagInputBoxHook.setInputedTags((ary) => {
            return [...ary, { text: item, exists }];
        });
        tagInputBoxHook.suggestionWindowHook.close();
        inputBox.value = "";
    }, [tagInputBoxHook.inputedTags])

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

    const appHotkeyHook = useAppHotkey();
    const { keybinds } = useConfig()

    useEffect(() => {
        if (
            tagInputBoxHook.suggestionWindowHook.items
                .length === 0
        ) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.CREATE_NEW_BOOKMARK);
        } else {
            appHotkeyHook.switchScope(
                HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW
            );
        }
    }, [tagInputBoxHook.suggestionWindowHook.items]);

    useHotkeys(
        keybinds.cancelCreateNewBookmark,
        onClickCancel,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.doneCreateNewBookmark,
        onClickDone,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.addFocusedSuggestionItem,
        tagInputBoxHook.addFocusedSuggestionItem,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.popInputedTag,
        onKeyDownBackspace,
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], enableOnFormTags: true },
    );


    useHotkeys("/", tagInputBoxHook.focusPredicateInputBox,
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
            keyup: true,
            keydown: false,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.focusDownSuggestionWindow,
        tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.focusUpSuggestionWindow,
        tagInputBoxHook.suggestionWindowHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    const { colorTheme } = useConfig()
    const props: BookmarkFormProps = {
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
        takeInputTag,
        setUrl,
    };
}