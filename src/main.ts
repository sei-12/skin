import { Assert } from "./common/Assert";
import { BkmkList } from "./Elements/BkmkList/lib";
import { BkmkPredicateInputBox } from "./Elements/BkmkPredicateInputBox/BkmkPredicateInputBox";
import { TagSuggestionWindow } from "./Elements/TagSuggestionWindow/TagSuggestionWindow";
import { CommandEmiterCore } from "./lib/EmiterCore";

/**
 * TagFinderインターフェースを実装したクラス
 */
class SimpleTagFinder implements TagSuggestionWindow.TagFinder {
    private taglist: string[] = [
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
    ];

    async find(predicate: string): Promise<string[]> {
        if (predicate === "") {
            return []
        }

        return this.taglist
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

class BkmkData implements BkmkList.ItemData {
    private static taglist: string[] = [
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
    ];
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
            const randomIndex = Math.floor(Math.random() * BkmkData.taglist.length);
            result.push( BkmkData.taglist[randomIndex] )
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
}


const emiter = new CommandEmiterCore()
const container = document.getElementById("container")

Assert.isNotNull(container)

const bkmkPredicateInputBox = new BkmkPredicateInputBox(
    new SimpleTagFinder(),
    emiter
)

const bkmkList = new BkmkList.Element(
    emiter
)

bkmkList.update([
    new BkmkData("hello"),
    new BkmkData(),
    new BkmkData("hello"),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
    new BkmkData(),
])

bkmkPredicateInputBox.setHandleOnChange(() => {
    console.log(bkmkPredicateInputBox.getPredicate().tags())
})

container.appendChild(bkmkPredicateInputBox.root)
container.appendChild(bkmkList.root)

window.addEventListener("keyup", (e) => {
    if (e.key === "/") {
        emiter.emit("focusBkmkPredicateInputbox")
    }
})

window.addEventListener("keydown", (e) => {

    if (e.ctrlKey === false) {
        return
    }

    if (e.key === "n") {
        console.log("hello")
        // emiter.emit("tagSuggestionWindow.focusDown")
        emiter.emit("bkmkList.focusDown")
    }
    if (e.key === "p") {
        console.log("hello")
        // emiter.emit("tagSuggestionWindow.focusUp")
        emiter.emit("bkmkList.focusUp")
    }
    if (e.key === "Enter") {
        emiter.emit("tagSuggestionWindow.Done")
    }
})