import { Box, Button, Grid2, Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IData } from "./data";
import { BookmarkList } from "./components/BookmarkList";
import { SuggestionWindow } from "./components/SuggestionWindow";

async function decoyDb_fetchBookmarks(predicateTags: string[]): Promise<IData.Bookmark[]> {
	let bkmks = [
		{key: crypto.randomUUID(),title:"hello1",desc: "this is description", tags: ["hello","aaa","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:"hello8",desc: "this is description", tags: ["hello","aaa","gummy"]},
		{key: crypto.randomUUID(),title:"hello1",desc: "this is description", tags: ["abc","aaa","hey"]},
		{key: crypto.randomUUID(),title:"hello6",desc: "this is description", tags: ["todo","typescript","hey"]},
		{key: crypto.randomUUID(),title:"hello2",desc: "this is description", tags: ["todo","ass","hey"]},
		{key: crypto.randomUUID(),title:"hello3",desc: "this is description", tags: ["abcde","uuid","hey"]},
		{key: crypto.randomUUID(),title:"hello5",desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:"hello9",desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:"hello6",desc: "this is description", tags: ["todo","typescript","hey"]},
		{key: crypto.randomUUID(),title:"hello6",desc: "this is description", tags: ["todo","typescript","hey"]},
		{key: crypto.randomUUID(),title:"hello6",desc: "this is description".repeat(10), tags: ["todo","typescript","hey"]},
		{key: crypto.randomUUID(),title:"hello6",desc: "this is description", tags: ["todo","typescript","hey"]},
		{key: crypto.randomUUID(),title:"aa",desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:"hhh",desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
		{key: crypto.randomUUID(),title:crypto.randomUUID(),desc: "this is description", tags: ["uuu","uid","hey"]},
	]

    let filted = bkmks.map( b => {
        return { ...b, url: "url://url"}
    })

	predicateTags.forEach( ptag => {
		filted = filted.filter( t => t.tags.includes(ptag) )
	})

	return filted
}

function filterTags(predicate: string){
	const TAG_LIST = [
		"typescript", "javascript", "python", "java", "csharp", "ruby", "php", "swift", "kotlin", "golang",
		"rust", "scala", "haskell", "perl", "sql", "html", "css", "sass", "less", "json","gist","clang","cpp",
		"xml", "yaml", "docker", "kubernetes", "aws", "azure", "gcp", "firebase", "react", "vue",
		"angular", "svelte", "jquery", "nodejs", "express", "nestjs", "deno", "nextjs", "nuxtjs", "remix",
		"webpack", "rollup", "vite", "babel", "eslint", "prettier", "jest", "mocha", "chai", "vitest",
		"playwright", "puppeteer", "selenium", "cypress", "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins",
		"travis", "circleci", "databases", "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "oracle",
		"machinelearning", "ai", "deeplearning", "nlp", "opencv", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
		"numpy", "matplotlib", "seaborn", "debugging", "logging", "profiling", "performance", "optimizations", "http", "api",
		"rest", "graphql", "websocket", "oauth", "jwt", "jsonwebtokens", "auth0", "passportjs", "security", "encryption", "hello", "main"
	] as const;
	
	if( predicate === ""){
		return []
	}
	
		
	return TAG_LIST.filter( tag => tag.includes(predicate))
}

function App() {

    const [items, setItems] = useState<IData.Bookmark[]>([])
    useEffect(() => { decoyDb_fetchBookmarks([]).then(data => setItems(data))},[])

	let inputBoxRef = useRef<HTMLInputElement>(null)
    const [focusIndex, setFocusIndex] = useState(0)
	const [predicate,setPredicate] = useState("j")
	const [suggestionItems,setSuggestionItems] = useState<string[]>([])
	const [sfocusIndex,setSFocusIndex] = useState(0)

	useEffect(() => {
		setSuggestionItems(filterTags(predicate))
	},[predicate])

    return (
        <Box
            sx={{ 
                width: "100vw", 
                height: "100vh",
                top:0,
                left: 0,
                overflow: "hidden",
                padding: 3,
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
                <Grid2 size="auto" spacing={0}>
                    <Input ref={inputBoxRef} onChange={(e) => setPredicate(e.target.value)}></Input>
                    <SuggestionWindow
                        focusIndex={sfocusIndex}
                        predicate={predicate}
                        items={suggestionItems}
                    ></SuggestionWindow>
                </Grid2> 

                <Grid2 
                    size="grow" 
                    sx={{ overflow: "hidden", display: "flex" }}
                >
                    <BookmarkList
                        focusIndex={focusIndex}
                        onClickEdit={() => {}}
                        onClickRemove={() => {}}
                        items={items}
                    ></BookmarkList>
                </Grid2>
            </Grid2>
        </Box>

    );
}

export default App;
