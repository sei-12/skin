import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbConnection } from "../lib/database";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { WindowVisibleController } from "../lib/windowVisibleController";
import { listen } from "@tauri-apps/api/event";
import { SearchBookmarkProps } from "../components/SearchBookmark";
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

    // 外部にコールバック関数を渡すように変更する
    useEffect(() => {
        // ウィンドウを表示/非表示
        register("Alt+Z", async (event) => {
            if (event.state === "Released") {
                return;
            }

            const curVisibility = await WindowVisibleController.currentVisible();
            if (curVisibility) {
                WindowVisibleController.hide();
            } else {
                WindowVisibleController.show();
                tagInputBoxHook.inputBoxRef.current?.focus();
            }
        });

        listen("tauri://blur", async () => {
            // TODO: 重複した処理 CA2897EB
            WindowVisibleController.hide();
            // 再度開いた時に前回の検索結果などが残らないようにする。
            tagInputBoxHook.setInputedTags([]);
        });
    },[]);

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
        () => {
            bkmkListHook.setFocusIndex((cur) => {
                let newIndex = cur + 1;
                if (newIndex >= bkmkListHook.items.length) {
                    newIndex = 0;
                }
                return newIndex;
            });
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [bkmkListHook.items]
    );

    useHotkeys(
        "ctrl+p",
        () => {
            bkmkListHook.setFocusIndex((cur) => {
                let newIndex = cur - 1;
                if (newIndex < 0) {
                    newIndex = bkmkListHook.items.length - 1;
                }
                return newIndex;
            });
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [bkmkListHook.items]
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
