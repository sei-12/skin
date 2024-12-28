import {
    CreateNewBookmark,
    useCreateNewBookmark,
} from "../views/CreateNewBookmark";
import { dbConnection } from "../lib/database";
import { invoke } from "@tauri-apps/api/core";
import { FindTagMethod } from "../components/SuggestionWindow";
import { HOTKEY_SCOPES, useAppHotkey } from "../lib/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    let inputedTagsSet = new Set(inputedTags);
    let dbResult = await dbConnection.findTag(predicate);
    let filted = dbResult.filter((t) => inputedTagsSet.has(t) === false);
    return filted;
};

function useCreateNewBookmarkPage() {
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

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <CreateNewBookmark {...hook.props} />;
}
