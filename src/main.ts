import { BkmkList } from "./Elements/BkmkList/lib";
import { BkmkPredicate } from "./Elements/BkmkPredicateInputBox/BkmkPredicateInputBox";
import { BkmkFinder, ScreenRootElement } from "./Elements/ScreenRoot/lib";
import { TagSuggestionWindow } from "./Elements/TagSuggestionWindow/TagSuggestionWindow";
import { CommandEmiterCore } from "./lib/EmiterCore";

import { confirm } from '@tauri-apps/plugin-dialog';


const TAG_LIST = [
    "typescript", "javascript", "python", "java", "csharp", "ruby", "php", "swift", "kotlin", "golang",
    "rust", "scala", "haskell", "perl", "sql", "html", "css", "sass", "less", "json",
    "xml", "yaml", "docker", "kubernetes", "aws", "azure", "gcp", "firebase", "react", "vue",
    "angular", "svelte", "jquery", "nodejs", "express", "nestjs", "deno", "nextjs", "nuxtjs", "remix",
    "webpack", "rollup", "vite", "babel", "eslint", "prettier", "jest", "mocha", "chai", "vitest",
    "playwright", "puppeteer", "selenium", "cypress", "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins",
    "travis", "circleci", "databases", "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "oracle",
    "machinelearning", "ai", "deeplearning", "nlp", "opencv", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
    "numpy", "matplotlib", "seaborn", "debugging", "logging", "profiling", "performance", "optimizations", "http", "api",
    "rest", "graphql", "websocket", "oauth", "jwt", "jsonwebtokens", "auth0", "passportjs", "security", "encryption", "hello", "main"
] as const;

/**
 * TagFinderインターフェースを実装したクラス
 */
class SampleTagFinder implements TagSuggestionWindow.TagFinder {
    async find(predicate: string): Promise<string[]> {
        if (predicate === "") {
            return []
        }

        return TAG_LIST
            .filter(tag => tag.includes(predicate))
            .sort((a, b) => {
                const aStartsWith = a.startsWith(predicate) ? 0 : 1;
                const bStartsWith = b.startsWith(predicate) ? 0 : 1;

                if (aStartsWith !== bStartsWith) {
                    return aStartsWith - bStartsWith; // 先頭一致優先
                }

                return a.localeCompare(b); // アルファベット順
            });
    }
}

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

function setHotkey(emiter: CommandEmiterCore){
    window.addEventListener("keyup", (e) => {
        if (e.key === "/") {
            emiter.emit("focusBkmkPredicateInputbox")
        }
    })

    window.addEventListener("keydown", (e) => {

        if (e.key === "n" && e.ctrlKey) {
            emiter.emit("tagSuggestionWindow.focusDown")
        }
        if (e.key === "p" && e.ctrlKey) {
            emiter.emit("tagSuggestionWindow.focusUp")
        }
        if (e.key === "Enter") {
            emiter.emit("tagSuggestionWindow.Done")
        }
        
        if ( e.key === "n" && e.metaKey ){
            emiter.emit("bkmkList.focusDown")
        }
        
        if ( e.key === "p" && e.metaKey ){
            emiter.emit("bkmkList.focusUp")
        }
    })
}

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
    const emiter = new CommandEmiterCore()
    setHotkey(emiter)
    
    const screenRoot = new ScreenRootElement(
        new SampleTagFinder(),
        new BkmkFinderImplement(),
        emiter
    )
    
    document.body.appendChild(screenRoot.root)
}


main().catch( async err => {
    console.error(err)
    
    let res = await confirm("予期しないエラーが発生しました。ウィンドウを再読み込みしますか？",{
        kind: "error"
    })
    
    if ( res ){
        window.location.reload()
    }
})