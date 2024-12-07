import { ScreenRootElement } from "./Elements/ScreenRoot/lib";
import { CommandEmiterCore } from "./lib/CommandEmmiter";
import { DbConnection } from "./lib/DataBase";

import { ShourtcutScopeManager } from "./lib/ShourtcutScopeManager";
import { HotkeyManager } from "./lib/HotkeyManager";
import { h } from "./common/dom";


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


async function main() {
    const dbConnection = await DbConnection.connect()
    
    // デバッグ時のみ
    {
        const db = dbConnection.debbugging()
        for (let i = 0; i < TAG_LIST.length; i++) {
            await db.ifNotEixstsThenInsertTag(TAG_LIST[i])
        }
    }

    const emiter = new CommandEmiterCore()
    const shourtcutScopeManager = new ShourtcutScopeManager()
    const hotkeyManager = new HotkeyManager()
    
    hotkeyManager.startListen(window,shourtcutScopeManager,emiter)

    
    const screenRoot = new ScreenRootElement(
        dbConnection.tagFinder(),
        dbConnection.bkmkFinder(),
        emiter,
        dbConnection.bkmkCreater(),
        shourtcutScopeManager
    )
    
    document.body.appendChild(screenRoot.root)
    
    

    // もっといい方法があると思われる
    return new Promise( _resolve => {})
}


main()
.catch( async err => {
    console.error(err)
    
    let errElm = h("div")
    
    errElm.root.innerText = "エラーが発生"
    errElm.root.style.backgroundColor = "rgb(100,10,10)"
    errElm.root.style.height = "100vh"
    errElm.root.style.width = "100vw"
    errElm.root.style.position = "absolute"

    document.body.appendChild(errElm.root)
})
.then(() => {
    console.error("mainから出て欲しくない")
})