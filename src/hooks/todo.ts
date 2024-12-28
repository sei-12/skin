// あとでファイル分ける
// 

import { useEffect, useRef } from "react";
import { FindTagMethod } from "../components/SuggestionWindow";
import { useNavigate } from "react-router-dom";
import { dbConnection } from "../lib/database";
import { invoke } from "@tauri-apps/api/core";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
// import { useBookmarkList } from "../components/BookmarkList";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { WindowVisibleController } from "../lib/windowVisibleController";
import { listen } from "@tauri-apps/api/event";
import { SearchBookmarkProps } from "../components/SearchBookmark";
import { useBookmarkList } from "./BookmarkList";
import { useTagInputBox } from "./TagInputBox";

const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    let inputedTagsSet = new Set(inputedTags);
    let dbResult = await dbConnection.findTag(predicate);
    let filted = dbResult.filter((t) => inputedTagsSet.has(t) === false);
    return filted;
};

export function useCreateNewBookmark(
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
        if (titleRef.current === null) {
            return;
        }
        if (urlRef.current === null) {
            return;
        }
        if (descRef.current === null) {
            return;
        }

        return {
            title: titleRef.current.value,
            desc: descRef.current.value,
            url: urlRef.current.value,
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

        dbConnection
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
        console.log("onChangeUrl!!");
        let content = (await invoke("fetch_website_content", { url })) as {
            title: string;
            desc: string;
        };
        let currentContent = createNewBookmarkHook.getInputData();

        let setData = (cur: string | undefined, newContent: string | null) => {
            if (cur !== undefined && cur !== "") {
                return cur;
            }

            if (newContent !== null) {
                return newContent;
            }

            return "";
        };

        let title = setData(currentContent?.title, content.title);
        let desc = setData(currentContent?.desc, content.desc);
        createNewBookmarkHook.setContent(title, desc);
    };

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
        () => {
            onClickCreateCancel();
        },
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    useHotkeys(
        "ctrl+Enter",
        () => {
            onClickCreateDone();
        },
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [createNewBookmarkHook]
    );

    useHotkeys(
        "Enter",
        async () => {
            let inputBox =
                createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current;
            let item =
                createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.getFocusedItem();
            if (item === undefined) {
                return;
            }
            if (inputBox === null) {
                return;
            }
            inputBox.value = "";
            let exists = await dbConnection.isExistsTag(item);
            createNewBookmarkHook.tagInputBoxHook.setInputedTags((ary) => {
                return [...ary, { text: item, exists: exists }];
            });
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close();
        },
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [createNewBookmarkHook.tagInputBoxHook]
    );

    useHotkeys(
        "Backspace",
        () => {
            let inputBox =
                createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current;
            if (inputBox === null) {
                return;
            }
            if (inputBox.value !== "") {
                return;
            }
            createNewBookmarkHook.tagInputBoxHook.setInputedTags((ary) => {
                ary.pop();
                return [...ary];
            });
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], enableOnFormTags: true },
        []
    );

    useHotkeys(
        "Space",
        async () => {
            let inputBox =
                createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current;
            if (inputBox === null) {
                return;
            }
            if (inputBox.value === "") {
                return;
            }
            let item = inputBox.value;

            let inputedTags = createNewBookmarkHook.getInputData()?.tags || [];
            let has = inputedTags.find((t) => t == item) !== undefined;
            if (has) {
                return;
            }

            let exists = await dbConnection.isExistsTag(item);
            createNewBookmarkHook.tagInputBoxHook.setInputedTags((ary) => {
                return [...ary, { text: item, exists }];
            });
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close();
            inputBox.value = "";
        },
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
        () => {
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setFocusIndex(
                (cur) => {
                    let newIndex = cur + 1;
                    if (
                        newIndex >=
                        createNewBookmarkHook.tagInputBoxHook
                            .suggestionWindowHook.items.length
                    ) {
                        newIndex = 0;
                    }
                    return newIndex;
                }
            );
        },
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items]
    );

    useHotkeys(
        "ctrl+p",
        () => {
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setFocusIndex(
                (cur) => {
                    let newIndex = cur - 1;
                    if (newIndex < 0) {
                        newIndex =
                            createNewBookmarkHook.tagInputBoxHook
                                .suggestionWindowHook.items.length - 1;
                    }
                    return newIndex;
                }
            );
        },
        {
            scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW],
            preventDefault: true,
            enableOnFormTags: true,
        },
        [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items]
    );

    return {
        props: createNewBookmarkHook.props,
    };
}

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
        bkmkListProps: bkmkListHook.props,
        tagInputBoxProps: tagInputBoxHook.props,
        onClickAdd,
    };
}
