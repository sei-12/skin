import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbConnection } from "../lib/database";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { WindowVisibleController } from "../lib/windowVisibleController";
import type { SearchBookmarkProps } from "../components/SearchBookmark";
import { useBookmarkList } from "./BookmarkList";
import { useTagInputBox } from "./TagInputBox";
import { findTagMethod } from "../lib/findTagMethod";


export function useSearchBookmarkPage() : SearchBookmarkProps {
    const navigate = useNavigate()

    const bkmkListHook = useBookmarkList(
        (id) => {
            dbConnection.deleteBookmark(id).then(() => {
                dbConnection
                    .findBookmark(
                        tagInputBoxHook.inputedTags.map((i) => i.text)
                    )
                    .then((data) => {
                        bkmkListHook.setItems(data);
                    });
            });
        },
        () => console.log("onclick edit!!")
    );

    const tagInputBoxHook = useTagInputBox(findTagMethod);

    const appHotkeyHook = useAppHotkey();

    useEffect(() => {
        if (tagInputBoxHook.suggestionWindowHook.items.length === 0) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SEARCH_BOOKMARK);
        } else {
            appHotkeyHook.switchScope(
                HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW
            );
        }
    }, [tagInputBoxHook.suggestionWindowHook.items]);

    useEffect(() => {
        const tags = tagInputBoxHook.inputedTags.map((e) => {
            return e.text;
        });
        dbConnection.findBookmark(tags).then((data) => {
            bkmkListHook.setItems(data);
            bkmkListHook.setFocusIndex(0);
        });
    }, [tagInputBoxHook.inputedTags]);
    
    const onClickAdd = () => {
        navigate("/create-new-bookmark")
    }

    useHotkeys(
        "Escape",
        () => {
            // TODO: 重複した処理 CA2897EB
            WindowVisibleController.hide();

            // 再度開いた時に前回の検索結果などが残らないようにする。
            tagInputBoxHook.setInputedTags([]);
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    // おそらくuseCallbackを利用できる
    useHotkeys(
        "ctrl+n",
        bkmkListHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        "ctrl+p",
        bkmkListHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        "ctrl+n",
        tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys(
        "ctrl+p",
        tagInputBoxHook.suggestionWindowHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys(
        "/",
        () => {
            tagInputBoxHook.inputBoxRef.current?.focus();
        },
        {
            keydown: false,
            keyup: true,
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        },
        []
    );

    useHotkeys(
        "Enter",
        () => {
            const item = tagInputBoxHook.suggestionWindowHook.getFocusedItem();
            const inputBox = tagInputBoxHook.inputBoxRef.current;

            if (inputBox === null) {
                return;
            }
            if (item === undefined) {
                return;
            }

            inputBox.value = "";
            tagInputBoxHook.setInputedTags((ary) => {
                return [...ary, { text: item, exists: true }];
            });
            tagInputBoxHook.suggestionWindowHook.close();
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [tagInputBoxHook]
    );

    useHotkeys(
        "Backspace",
        () => {
            const inputBox = tagInputBoxHook.inputBoxRef.current;

            if (inputBox === null) {
                return;
            }
            if (inputBox.value !== "") {
                return;
            }

            inputBox.value = "";
            tagInputBoxHook.setInputedTags((ary) => {
                ary.pop();
                return [...ary];
            });
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], enableOnFormTags: true },
        []
    );

    useHotkeys(
        "ctrl+a",
        () => {
            navigate("/create-new-bookmark");
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: false,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys(
        "Escape",
        () => {
            const inputBox = tagInputBoxHook.inputBoxRef.current;
            if (inputBox === null) {
                return;
            }
            tagInputBoxHook.suggestionWindowHook.close();
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );


    return {
        bkmkListProps: bkmkListHook.props,
        tagInputBoxProps: tagInputBoxHook.props,
        onClickAdd,
    };
}
