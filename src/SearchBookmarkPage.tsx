import { useEffect } from "react";
import { useBookmarkList } from "./components/BookmarkList";
import { useTagInputBox } from "./components/TagInputBox";
import { useHotkeys } from "react-hotkeys-hook";
import { HOTKEY_SCOPES, useAppHotkey } from "./lib/hotkey";
import { SearchBookmark } from "./views/SearchBookmark";
import { dbConnection } from "./lib/database";

import { register } from "@tauri-apps/plugin-global-shortcut";
import { listen } from "@tauri-apps/api/event";
import { WindowVisibleController } from "./lib/windowVisibleController";
import { FindTagMethod } from "./components/SuggestionWindow";
import { useNavigate } from "react-router-dom";

const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    let inputedTagsSet = new Set(inputedTags);
    let dbResult = await dbConnection.findTag(predicate);
    let filted = dbResult.filter((t) => inputedTagsSet.has(t) === false);
    return filted;
};

function useSearchBookmarkPage() {
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
        // ウィンドウを表示/非表示
        register("Alt+Z", async (event) => {
            if (event.state === "Released") {
                return;
            }

            let curVisibility = await WindowVisibleController.currentVisible();
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
    }, []);

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
        let tags = tagInputBoxHook.inputedTags.map((e) => {
            return e.text;
        });
        dbConnection.findBookmark(tags).then((data) => {
            bkmkListHook.setItems(data);
            bkmkListHook.setFocusIndex(0);
        });
    }, [tagInputBoxHook.inputedTags]);
    
    const onClickAdd = () => {
        navigate("/c")
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
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex((cur) => {
                let newIndex = cur + 1;
                if (
                    newIndex >=
                    tagInputBoxHook.suggestionWindowHook.items.length
                ) {
                    newIndex = 0;
                }
                return newIndex;
            });
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [tagInputBoxHook.suggestionWindowHook.items]
    );

    useHotkeys(
        "ctrl+p",
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex((cur) => {
                let newIndex = cur - 1;
                if (newIndex < 0) {
                    newIndex =
                        tagInputBoxHook.suggestionWindowHook.items.length - 1;
                }
                return newIndex;
            });
        },
        {
            scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [tagInputBoxHook.suggestionWindowHook.items]
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
            let item = tagInputBoxHook.suggestionWindowHook.getFocusedItem();
            let inputBox = tagInputBoxHook.inputBoxRef.current;

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
            let inputBox = tagInputBoxHook.inputBoxRef.current;

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
            navigate("/c");
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
            let inputBox = tagInputBoxHook.inputBoxRef.current;
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
        bkmkListHook,
        tagInputBoxHook,
        onClickAdd,
    };
}

export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark
        onClickAdd={hook.onClickAdd}
        tagInputBoxHook={hook.tagInputBoxHook.props}
        bkmkListHook={hook.bkmkListHook.props}
    />;
}