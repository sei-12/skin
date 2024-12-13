import { Box, Grid2 } from "@mui/material";
import { useEffect } from "react";
import { IData } from "./data";
import { BookmarkList, useBookmarkList } from "./components/BookmarkList";
import { TagInputBox, useTagInputBox } from "./components/TagInputBox";
import { useHotkeys } from "react-hotkeys-hook";
import { HOTKEY_SCOPES, useAppHotkey } from "./hotkey";

async function decoyDb_fetchBookmarks(predicateTags: string[]): Promise<IData.Bookmark[]> {
    let bkmks = [
        { key: crypto.randomUUID(), title: "hello1", desc: "this is description", tags: ["hello", "aaa", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: "hello8", desc: "this is description", tags: ["hello", "aaa", "gummy"] },
        { key: crypto.randomUUID(), title: "hello1", desc: "this is description", tags: ["abc", "aaa", "hey"] },
        { key: crypto.randomUUID(), title: "hello6", desc: "this is description", tags: ["todo", "typescript", "hey"] },
        { key: crypto.randomUUID(), title: "hello2", desc: "this is description", tags: ["todo", "ass", "hey"] },
        { key: crypto.randomUUID(), title: "hello3", desc: "this is description", tags: ["abcde", "uuid", "hey"] },
        { key: crypto.randomUUID(), title: "hello5", desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: "hello9", desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: "hello6", desc: "this is description", tags: ["todo", "typescript", "hey"] },
        { key: crypto.randomUUID(), title: "hello6", desc: "this is description", tags: ["todo", "typescript", "hey"] },
        { key: crypto.randomUUID(), title: "hello6", desc: "this is description".repeat(10), tags: ["todo", "typescript", "hey"] },
        { key: crypto.randomUUID(), title: "hello6", desc: "this is description", tags: ["todo", "typescript", "hey"] },
        { key: crypto.randomUUID(), title: "aa", desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: "hhh", desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
        { key: crypto.randomUUID(), title: crypto.randomUUID(), desc: "this is description", tags: ["uuu", "uid", "hey"] },
    ]

    let filted = bkmks.map(b => {
        return { ...b, url: "url://url" }
    })

    predicateTags.forEach(ptag => {
        filted = filted.filter(t => t.tags.includes(ptag))
    })

    return filted
}

function filterTags(predicate: string) {
    const TAG_LIST = [
        "typescript", "javascript", "python", "java", "csharp", "ruby", "php", "swift", "kotlin", "golang",
        "rust", "scala", "haskell", "perl", "sql", "html", "css", "sass", "less", "json", "gist", "clang", "cpp",
        "xml", "yaml", "docker", "kubernetes", "aws", "azure", "gcp", "firebase", "react", "vue",
        "angular", "svelte", "jquery", "nodejs", "express", "nestjs", "deno", "nextjs", "nuxtjs", "remix",
        "webpack", "rollup", "vite", "babel", "eslint", "prettier", "jest", "mocha", "chai", "vitest",
        "playwright", "puppeteer", "selenium", "cypress", "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins",
        "travis", "circleci", "databases", "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "oracle",
        "machinelearning", "ai", "deeplearning", "nlp", "opencv", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
        "numpy", "matplotlib", "seaborn", "debugging", "logging", "profiling", "performance", "optimizations", "http", "api",
        "rest", "graphql", "websocket", "oauth", "jwt", "jsonwebtokens", "auth0", "passportjs", "security", "encryption", "hello", "main"
    ] as const;

    if (predicate === "") {
        return []
    }


    return TAG_LIST.filter(tag => tag.includes(predicate))
}

function App() {


    const bkmkListHook = useBookmarkList(
        () => console.log("onclick remove!!"),
        () => console.log("onclick edit!!")
    )

    // TOOD: この処理はフックの中でいい気がする。
    const onChangePredicateInputBox = async () => {
        let inputBox = tagInputBoxHook.inputBoxRef.current
        if (inputBox === null) { return }


        let suggestionItems = filterTags(inputBox.value)
        tagInputBoxHook.suggestionWindowHook.setItems(suggestionItems)
        tagInputBoxHook.suggestionWindowHook.setPredicate(inputBox.value)
        tagInputBoxHook.suggestionWindowHook.setFocusIndex(0)
    }

    const tagInputBoxHook = useTagInputBox(
        onChangePredicateInputBox
    )
    
    const appHotkeyHook = useAppHotkey()

    //
    //
    // EFFECTS
    //
    //

    useEffect(() => {
        if ( tagInputBoxHook.suggestionWindowHook.items.length === 0){
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SEARCH_BOOKMARK)
        }else{
            appHotkeyHook.switchScope(HOTKEY_SCOPES.SUGGESTION_WINDOW)
        }
    },[tagInputBoxHook.suggestionWindowHook.items])

    useEffect(() => {
        tagInputBoxHook.setInputedTags([
            { text: "t", exists: true },
            { text: "tag1", exists: true },
            { text: "tag3", exists: true },
            { text: "tag3", exists: true },
        ])
    }, [])
    useEffect(() => { decoyDb_fetchBookmarks([]).then(data => bkmkListHook.setItems(data)) }, [])


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
        "ctrl+n",
        () => {
            bkmkListHook.setFocusIndex( cur => {
                let newIndex = cur + 1
                if ( newIndex >= bkmkListHook.items.length ){
                    newIndex = 0
                }
                return newIndex
            })
        },
        {scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],preventDefault: true,enableOnFormTags: true},
        [bkmkListHook.items]
    )

    useHotkeys(
        "ctrl+p",
        () => {
            bkmkListHook.setFocusIndex( cur => {
                let newIndex = cur - 1
                if (newIndex < 0){
                    newIndex = bkmkListHook.items.length - 1
                }
                return newIndex
            })
        },
        {scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],preventDefault: true,enableOnFormTags: true},
        [bkmkListHook.items]
    )

    useHotkeys(
        "ctrl+n",
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex( cur => {
                let newIndex = cur + 1
                if ( newIndex >= tagInputBoxHook.suggestionWindowHook.items.length ){
                    newIndex = 0
                }
                return newIndex
            })
        },
        {scopes: [HOTKEY_SCOPES.SUGGESTION_WINDOW],preventDefault: true,enableOnFormTags: true},
        [tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "ctrl+p",
        () => {
            tagInputBoxHook.suggestionWindowHook.setFocusIndex( cur => {
                let newIndex = cur - 1
                if (newIndex < 0){
                    newIndex = tagInputBoxHook.suggestionWindowHook.items.length - 1
                }
                return newIndex
            })
        },
        {scopes: [HOTKEY_SCOPES.SUGGESTION_WINDOW],preventDefault: true,enableOnFormTags: true},
        [tagInputBoxHook.suggestionWindowHook.items]
    )

    useHotkeys(
        "/",
        () => {
            tagInputBoxHook.inputBoxRef.current?.focus()
        },
        {keydown: false, keyup: true, scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK] },
        []
    )
    
    useHotkeys(
        "Enter",
        () => {
            let item = tagInputBoxHook.suggestionWindowHook.getFocusedItem()
            let inputBox = tagInputBoxHook.inputBoxRef.current

            if ( inputBox === null ){ return }
            if ( item === undefined ){ return }

            inputBox.value = ""
            tagInputBoxHook.setInputedTags(ary => { return [...ary, { text: item, exists: true }]})
            tagInputBoxHook.suggestionWindowHook.close()
        },
        {scopes: [HOTKEY_SCOPES.SUGGESTION_WINDOW],preventDefault: true,enableOnFormTags: true},
        [tagInputBoxHook]
    )
    
    useHotkeys(
        "Backspace",
        () => {
            let inputBox = tagInputBoxHook.inputBoxRef.current

            if ( inputBox === null ){ return }
            if ( inputBox.value !== "" ){ return }

            inputBox.value = ""
            tagInputBoxHook.setInputedTags(ary => {
                ary.pop()
                return [...ary]
            })
        },
        {scopes: [HOTKEY_SCOPES.SEARCH_BOOKMARK],enableOnFormTags: true},
        []
    )
    
    useHotkeys(
        "Escape",
        () => {
            let inputBox = tagInputBoxHook.inputBoxRef.current
            if ( inputBox === null ){ return }
            tagInputBoxHook.suggestionWindowHook.close()
        },
        {scopes: [HOTKEY_SCOPES.SUGGESTION_WINDOW],preventDefault: true,enableOnFormTags: true},
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
            <Grid2
                container
                spacing={1}
                flexDirection={"column"}
                height={1}
                width={1}
            >
                <Grid2 size="auto">
                    <TagInputBox {...tagInputBoxHook.props} ></TagInputBox>
                </Grid2>

                <Grid2
                    size="grow"
                    sx={{ overflow: "hidden", display: "flex" }}
                >
                    <BookmarkList {...bkmkListHook.props}></BookmarkList>
                </Grid2>
            </Grid2>
        </Box>

    );
}

export default App;
