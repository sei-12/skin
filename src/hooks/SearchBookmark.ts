import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { WindowVisibleController } from "../lib/windowVisibleController";
import type { SearchBookmarkProps } from "../components/SearchBookmark";
import { useBookmarkList } from "./BookmarkList";
import { useTagInputBox } from "./TagInputBox";
import { findTagMethod } from "../lib/findTagMethod";
import { invoke } from "@tauri-apps/api/core";
import { DB } from "../lib/database";


export function useSearchBookmarkPage(): SearchBookmarkProps {
    const navigate = useNavigate()

    const onClickRemove = (id: number) => {
        DB.deleteBookmark(id).then(() => {
            DB
                .findBookmark(
                    tagInputBoxHook.inputedTags.map((i) => i.text)
                )
                .then((data) => {
                    bkmkListHook.setItems(data);
                });
        });
    }

    const bkmkListHook = useBookmarkList(
        onClickRemove,
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
        DB.findBookmark(tags).then((data) => {
            bkmkListHook.setItems(data);
            bkmkListHook.resetFocusIndex();
        });
    }, [tagInputBoxHook.inputedTags]);

    const closeWindow = useCallback(() => {
        WindowVisibleController.hide();
        tagInputBoxHook.setInputedTags([]);
    }, [])


    const openUrl = useCallback(() => {
        if (bkmkListHook.items.length === 0) { return }
        const focusedItem = bkmkListHook.getFocusedItem()
        if (focusedItem === undefined) {
            return
        }
        const url = focusedItem.url
        WindowVisibleController.hide()
        invoke("open_url", { url })
        tagInputBoxHook.setInputedTags([])
    }, [tagInputBoxHook, bkmkListHook])


    const navigateCreateNewBookmark = useCallback(() => {
        navigate("/create-new-bookmark")
    }, [])

    const closeSuggestionWindow = useCallback(() => {
        const inputBox = tagInputBoxHook.inputBoxRef.current;
        if (inputBox === null) {
            return;
        }
        tagInputBoxHook.suggestionWindowHook.close();
    }, [])



    // 
    //
    // hotkeys
    //
    // 

    useHotkeys("Escape", closeWindow,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("ctrl+n", bkmkListHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("ctrl+p", bkmkListHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("ctrl+n", tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("ctrl+p", tagInputBoxHook.suggestionWindowHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys("/", tagInputBoxHook.focusPredicateInputBox,
        {
            keydown: false,
            keyup: true,
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        },
    );

    useHotkeys("Enter", tagInputBoxHook.addFocusedSuggestionItem,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );


    useHotkeys("Backspace", tagInputBoxHook.popInputedTag,
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], enableOnFormTags: true }
    );

    useHotkeys("ctrl+a", navigateCreateNewBookmark,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: false,
            enableOnFormTags: true,
        },
    );


    useHotkeys("Escape", closeSuggestionWindow,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("Enter", openUrl,
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], preventDefault: true, enableOnFormTags: true },
    )

    return {
        bkmkListProps: bkmkListHook.props,
        tagInputBoxProps: tagInputBoxHook.props,
        onClickAdd: navigateCreateNewBookmark,
    };
}
