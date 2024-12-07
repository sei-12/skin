import { BkmkList } from "./Elements/BkmkList/lib";
import { BkmkPredicate } from "./Elements/BkmkPredicateInputBox/BkmkPredicateInputBox";
import { BkmkFinder, ScreenRootElement } from "./Elements/ScreenRoot/lib";
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

class DebugBkmkData implements BkmkList.ItemData {
     private getRandomString(maxlength: number): string {
        const chars = '        ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomLength = Math.floor(Math.random() * maxlength) + 1; // 1からmaxlengthまでのランダムな長さ
        let result = '';
        for (let i = 0; i < randomLength; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }
    private getRandomTagList(maxlength: number) {
        const randomLength = Math.floor(Math.random() * maxlength) + 1; // 1からmaxlengthまでのランダムな長さ
        let result:string[] = [];
        for (let i = 0; i < randomLength; i++) {
            const randomIndex = Math.floor(Math.random() * TAG_LIST.length);
            result.push( TAG_LIST[randomIndex] )
        }
        return result;
    }

    private url = "decoy://" + this.getRandomString(100)
    private desc = this.getRandomString(1000)
    private tags = this.getRandomTagList(10)
    private title = this.getRandomString(20)

    constructor(
        title?: string
    ) {
        if ( title ){
            this.title = title
        }
        
        this.tags.forEach( t => this.tagSet.add(t) )
    }

    getUrl(): string {
        return this.url
    }
    getTags(): string[] {
        return this.tags
    }
    getDesc(): string {
        return this.desc
    }

    getTitle(): string {
        return this.title
    }
   
    
    private tagSet = new Set<string>
    has(tag: string){
        return this.tagSet.has(tag)
    }
}

// function setHotkey(emiter: CommandEmiterCore){
//     window.addEventListener("keyup", (e) => {
//         if (e.key === "/") {
//             emiter.emit("focusBkmkPredicateInputbox")
//         }
//     })

//     window.addEventListener("keydown", (e) => {

//         if (e.key === "n" && e.ctrlKey) {
//             emiter.emit("tagSuggestionWindow.focusDown")
//         }
//         if (e.key === "p" && e.ctrlKey) {
//             emiter.emit("tagSuggestionWindow.focusUp")
//         }
//         if (e.key === "Enter") {
//             emiter.emit("tagSuggestionWindow.Done")
//         }
        
//         if ( e.key === "n" && e.metaKey ){
//             emiter.emit("createNewBkmk.start")
//         }
//     })
// }

class BkmkFinderImplement implements BkmkFinder {
    
    private tags = Array(10000).fill(null).map( _ => {
        return new DebugBkmkData()
    })

    async find(predicate: BkmkPredicate): Promise<BkmkList.ItemData[]> {
        let filted = this.tags
        let predicateTags = predicate.tags()

        predicateTags.forEach( t => {
            filted = filted.filter( bkmkdata => bkmkdata.has(t) )
        })
        
        return filted
    }
}

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
        new BkmkFinderImplement(),
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