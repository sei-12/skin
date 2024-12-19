import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useBookmarkList } from "./components/BookmarkList";
import { useTagInputBox } from "./components/TagInputBox";
import { useHotkeys } from "react-hotkeys-hook";
import { HOTKEY_SCOPES, useAppHotkey } from "./hotkey";
import { SearchBookmark } from "./views/SearchBookmark";
import { CreateNewBookmark, useCreateNewBookmark } from "./views/CreateNewBookmark";
import { dbConnection } from "./database";


function App() {

    const [showView, setShowView] = useState<"SEARCH_BOOKMARK" | "CREATE_NEW_BOOKMARK">("SEARCH_BOOKMARK")

    const onClickAddButton = () => {
        setShowView("CREATE_NEW_BOOKMARK")
    }

    const bkmkListHook = useBookmarkList(
        () => console.log("onclick remove!!"),
        () => console.log("onclick edit!!")
    )

    // TOOD: この処理はフックの中でいい気がする。
    const onChangePredicateInputBox = async () => {
        let inputBox = tagInputBoxHook.inputBoxRef.current
        if (inputBox === null) { return }


        let suggestionItems = await dbConnection.findTag(inputBox.value)
        tagInputBoxHook.suggestionWindowHook.setItems(suggestionItems)
        tagInputBoxHook.suggestionWindowHook.setPredicate(inputBox.value)
        tagInputBoxHook.suggestionWindowHook.setFocusIndex(0)
    }

    const tagInputBoxHook = useTagInputBox(
        onChangePredicateInputBox
    )

    const appHotkeyHook = useAppHotkey()
    const onClickCreateDone = () => {
        console.log("done")

        const inputData = createNewBookmarkHook.getInputData()
        if (inputData === undefined) { return }

        dbConnection.insertBookmark(
            inputData.title,
            inputData.url,
            inputData.desc,
            inputData.tags
        ).then(() => {
            createNewBookmarkHook.clearData()
            setShowView("SEARCH_BOOKMARK")
        })
    }

    const onChangeCreateNewBookmarkInputBox = async () => {
        let inputBox = createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current
        if (inputBox === null) { return }
        let suggestionItems = await dbConnection.findTag(inputBox.value)
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setItems(suggestionItems)
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setPredicate(inputBox.value)
        createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setFocusIndex(0)
    }

    const onClickCreateCancel = () => {
        console.log("cancel")
    }
    const createNewBookmarkHook = useCreateNewBookmark(
        onClickCreateDone,
        onClickCreateCancel,
        onChangeCreateNewBookmarkInputBox,
    )

    //
    //
    // EFFECTS
    //
    //

    useEffect(() => {
        if (tagInputBoxHook.suggestionWindowHook.items.length === 0) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SEARCH_BOOKMARK)
        } else {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW)
        }
    }, [tagInputBoxHook.suggestionWindowHook.items])

    useEffect(() => {
        if (createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items.length === 0) {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.CREATE_NEW_BOOKMARK)
        } else {
            appHotkeyHook.switchScope(HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW)
        }
    }, [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items])

    useEffect(() => {
        tagInputBoxHook.setInputedTags([])
    }, [])

    useEffect(() => {
        let tags = tagInputBoxHook.inputedTags.map(e => { return e.text })
        dbConnection.findBookmark(tags).then(data => {
            bkmkListHook.setItems(data)
        })
    }, [tagInputBoxHook.inputedTags])

    //
    //
    // HOTKEYS
    //
    //

    // TODO: フォーカスの移動の処理をまとめたい。useFocusIndexとか作りたい。
    // けど、ホットキーの設定をするときに依存関係を配列で渡さないといけなくて、それをどうやって対処するかで悩んでいる。
    // 配列もまとめて定義したらいいけど、中身を意識しないと使えない抽象化とかいういい加減な状態になる気がしている。
    //
    // TODO: というか、関数定義とホットキーの情報を分けて、動作とトリガーを分離したい。これはできる気がする。
    // 追記：本当にそれをすべきかなやんでいる。


    useHotkeys(
        "ctrl+a",
        () => {
            setShowView("CREATE_NEW_BOOKMARK")
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], preventDefault: false, enableOnFormTags: true },
        []
    )

    useHotkeys(
        "ctrl+n",
        () => {
            bkmkListHook.setFocusIndex(cur => {
                let newIndex = cur + 1
                if (newIndex >= bkmkListHook.items.length) {
                    newIndex = 0
                }
                return newIndex
            })
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], preventDefault: true, enableOnFormTags: true },
        [bkmkListHook.items]
    )

    useHotkeys(
        "ctrl+p",
        () => {
            bkmkListHook.setFocusIndex(cur => {
                let newIndex = cur - 1
                if (newIndex < 0) {
                    newIndex = bkmkListHook.items.length - 1
                }
                return newIndex
            })
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], preventDefault: true, enableOnFormTags: true },
        [bkmkListHook.items]
    )

    useHotkeys(
        "ctrl+n",
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex(cur => {
                let newIndex = cur + 1
                if (newIndex >= tagInputBoxHook.suggestionWindowHook.items.length) {
                    newIndex = 0
                }
                return newIndex
            })
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "ctrl+p",
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex(cur => {
                let newIndex = cur - 1
                if (newIndex < 0) {
                    newIndex = tagInputBoxHook.suggestionWindowHook.items.length - 1
                }
                return newIndex
            })
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "/",
        () => {
            tagInputBoxHook.inputBoxRef.current?.focus()
        },
        { keydown: false, keyup: true, scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK] },
        []
    )

    useHotkeys(
        "Enter",
        () => {
            let item = tagInputBoxHook.suggestionWindowHook.getFocusedItem()
            let inputBox = tagInputBoxHook.inputBoxRef.current

            if (inputBox === null) { return }
            if (item === undefined) { return }

            inputBox.value = ""
            tagInputBoxHook.setInputedTags(ary => { return [...ary, { text: item, exists: true }] })
            tagInputBoxHook.suggestionWindowHook.close()
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [tagInputBoxHook]
    )

    useHotkeys(
        "Backspace",
        () => {
            let inputBox = tagInputBoxHook.inputBoxRef.current

            if (inputBox === null) { return }
            if (inputBox.value !== "") { return }

            inputBox.value = ""
            tagInputBoxHook.setInputedTags(ary => {
                ary.pop()
                return [...ary]
            })
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK], enableOnFormTags: true },
        []
    )

    useHotkeys(
        "Escape",
        () => {
            let inputBox = tagInputBoxHook.inputBoxRef.current
            if (inputBox === null) { return }
            tagInputBoxHook.suggestionWindowHook.close()
        },
        { scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        []
    )


    useHotkeys(
        "Escape",
        () => {
            setShowView("SEARCH_BOOKMARK")
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], preventDefault: true, enableOnFormTags: true },
        []
    )

    useHotkeys(
        "ctrl+Enter",
        () => {
            onClickCreateDone()
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], preventDefault: true, enableOnFormTags: true },
        []
    )

    useHotkeys(
        "Enter",
        async () => {
            let inputBox = createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current
            let item = createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.getFocusedItem()
            if (item === undefined) { return }
            if (inputBox === null) { return }
            inputBox.value = ""
            let exists = await dbConnection.isExistsTag(item)
            createNewBookmarkHook.tagInputBoxHook.setInputedTags(ary => { return [...ary, { text: item, exists: exists }] })
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close()
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [createNewBookmarkHook.tagInputBoxHook]
    )

    useHotkeys(
        "ctrl+n",
        () => {
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setFocusIndex(cur => {
                let newIndex = cur + 1
                if (newIndex >= createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items.length) {
                    newIndex = 0
                }
                return newIndex
            })
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "ctrl+p",
        () => {
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.setFocusIndex(cur => {
                let newIndex = cur - 1
                if (newIndex < 0) {
                    newIndex = createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items.length - 1
                }
                return newIndex
            }
            )
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW], preventDefault: true, enableOnFormTags: true },
        [createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "Backspace",
        () => {
            let inputBox = createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current
            if (inputBox === null) { return }
            if (inputBox.value !== "") { return }
            createNewBookmarkHook.tagInputBoxHook.setInputedTags(ary => {
                ary.pop()
                return [...ary]
            })
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK], enableOnFormTags: true },
        []
    )


    useHotkeys(
        "Space",
        async () => {
            let inputBox = createNewBookmarkHook.tagInputBoxHook.inputBoxRef.current
            if (inputBox === null) { return }
            if (inputBox.value === "") { return }
            let item = inputBox.value
            let exists = await dbConnection.isExistsTag(item)
            createNewBookmarkHook.tagInputBoxHook.setInputedTags(ary => { return [...ary, { text: item, exists }] })
            createNewBookmarkHook.tagInputBoxHook.suggestionWindowHook.close()
            inputBox.value = ""
        },
        { scopes: [HOTKEY_SCOPES.CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW], enableOnFormTags: true },
        []
    )


    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
                overflow: "hidden",
                padding: 2,
                paddingTop: 1,
                flexGrow: 1,
            }}
        >
            {
                (() => {
                    if (showView === "SEARCH_BOOKMARK") {
                        return (<SearchBookmark onClickAdd={onClickAddButton} tagInputBoxHook={tagInputBoxHook.props} bkmkListHook={bkmkListHook.props} />)
                    }
                    if (showView === "CREATE_NEW_BOOKMARK") {
                        return (<CreateNewBookmark {...createNewBookmarkHook.props} />)
                    }
                })()
            }
        </Box>

    );
}

export default App;
