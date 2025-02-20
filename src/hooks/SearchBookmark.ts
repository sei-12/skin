import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOTKEY_SCOPES, useAppHotkey } from "./hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { WindowVisibleController } from "../services/windowVisibleController";
import type { SearchBookmarkProps } from "../components/SearchBookmark";
import { useBookmarkList } from "./BookmarkList";
import { useTagInputBox } from "./TagInputBox";
import { findTagMethod } from "../services/findTagMethod";
import { invoke } from "@tauri-apps/api/core";
import { DB } from "../services/database";
import { useConfig } from "../providers/configProvider";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";
import { useNotice } from "../providers/NoticeProvider";

export function useSearchBookmarkPage(): SearchBookmarkProps {
    const { keybinds, colorTheme } = useConfig();

    const { addNotice } = useNotice();
    const navigate = useNavigate();

    const onClickGoTagList = () => {
        navigate("/tag-list");
    };

    const onClickRemove = async (id: number) => {
        await DB.deleteBookmark(id)
            .then(() => {
                addNotice({
                    message: "SUCCESS!",
                    serverity: "success",
                });
            })
            .catch(() => {
                addNotice({
                    message: "ERROR!",
                    serverity: "error",
                });
            });
        reloadBookmarks();
    };

    const onClickEdit = (id: number) => {
        navigate("/edit-bookmark", { state: { bookmarkId: id } });
    };

    const bkmkListHook = useBookmarkList(onClickRemove, onClickEdit);

    const tagInputBoxHook = useTagInputBox(findTagMethod);

    const appHotkeyHook = useAppHotkey();

    const editFocusedBookmark = useCallback(() => {
        const focusedItem = bkmkListHook.getFocusedItem();
        if (focusedItem === undefined) {
            return;
        }
        navigate("/edit-bookmark", { state: { bookmarkId: focusedItem.id } });
    }, [bkmkListHook.getFocusedItem]);

    const removeFocusedBookmark = useCallback(async () => {
        const focusedItem = bkmkListHook.getFocusedItem();
        if (focusedItem === undefined) {
            return;
        }
        await DB.deleteBookmark(focusedItem.id)
            .then(() => {
                addNotice({
                    message: "SUCCESS!",
                    serverity: "success",
                });
            })
            .catch(() => {
                addNotice({
                    message: "ERROR!",
                    serverity: "error",
                });
            });

        await reloadBookmarks();
    }, [bkmkListHook.getFocusedItem]);

    const reloadBookmarks = useCallback(async () => {
        const tags = tagInputBoxHook.inputedTags.map((e) => {
            return e.text;
        });

        let bookmarks: Bookmark[];
        if (tags.length === 0) {
            bookmarks = await DB.fetchBookmarks(100).catch(() => {
                addNotice({
                    message: "ERROR!",
                    serverity: "error",
                });
                return [];
            });
        } else {
            bookmarks = await DB.findBookmark(tags).catch(() => {
                addNotice({
                    message: "ERROR!",
                    serverity: "error",
                });
                return [];
            });
        }

        bkmkListHook.setItems(bookmarks);
        bkmkListHook.resetFocusIndex();
    }, [tagInputBoxHook.inputedTags]);

    useEffect(() => {
        if (tagInputBoxHook.suggestionWindowHook.items.length === 0) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SEARCH_BOOKMARK);
        } else {
            appHotkeyHook.switchScope(
                HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW,
            );
        }
    }, [tagInputBoxHook.suggestionWindowHook.items]);

    useEffect(() => {
        reloadBookmarks();
    }, [tagInputBoxHook.inputedTags]);

    const closeWindow = useCallback(() => {
        WindowVisibleController.hide();
        tagInputBoxHook.setInputedTags([]);
        const inputBox = tagInputBoxHook.inputBoxRef.current;
        if (inputBox !== null) {
            inputBox.value = "";
        }
    }, []);

    const openUrl = useCallback(() => {
        if (bkmkListHook.items.length === 0) {
            return;
        }
        const focusedItem = bkmkListHook.getFocusedItem();
        if (focusedItem === undefined) {
            return;
        }
        const url = focusedItem.url;
        WindowVisibleController.hide();
        invoke("open_url", { url });
        tagInputBoxHook.setInputedTags([]);
    }, [tagInputBoxHook, bkmkListHook]);

    const navigateCreateNewBookmark = useCallback(() => {
        navigate("/create-new-bookmark");
    }, []);

    const closeSuggestionWindow = useCallback(() => {
        const inputBox = tagInputBoxHook.inputBoxRef.current;
        if (inputBox === null) {
            return;
        }
        tagInputBoxHook.suggestionWindowHook.close();
    }, []);

    //
    //
    // hotkeys
    //
    //

    useHotkeys(keybinds.closeWindow, closeWindow, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.focusDownBookmarkList, bkmkListHook.focusDown, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.focusUpBookmarkList, bkmkListHook.focusUp, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(
        keybinds.focusDownSuggestionWindow,
        tagInputBoxHook.suggestionWindowHook.focusDown,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(
        keybinds.focusUpSuggestionWindow,
        tagInputBoxHook.suggestionWindowHook.focusUp,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys("/", tagInputBoxHook.focusPredicateInputBox, {
        keydown: false,
        keyup: true,
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
    });

    useHotkeys(
        keybinds.addFocusedSuggestionItem,
        tagInputBoxHook.addFocusedSuggestionItem,
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
    );

    useHotkeys(keybinds.popInputedTag, tagInputBoxHook.popInputedTag, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.navigateCreateNewBookmark, navigateCreateNewBookmark, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: false,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.closeSuggestionWindow, closeSuggestionWindow, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.openUrl, openUrl, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.removeFocusedBookmark, removeFocusedBookmark, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    useHotkeys(keybinds.editFocusedBookmark, editFocusedBookmark, {
        scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
        preventDefault: true,
        enableOnFormTags: true,
    });

    return {
        bkmkListProps: bkmkListHook.props,
        tagInputBoxProps: tagInputBoxHook.props,
        colorTheme,
        onClickAdd: navigateCreateNewBookmark,
        onClickGoTagList,
    };
}
