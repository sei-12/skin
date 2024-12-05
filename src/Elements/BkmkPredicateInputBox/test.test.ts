import { expect, it } from "vitest";
import { TagSuggestionWindow } from "../TagSuggestionWindow/TagSuggestionWindow";
import { BkmkPredicateInputBox } from "./BkmkPredicateInputBox";
import { CommandEmiterCore } from "../../lib/EmiterCore";

class SampleTagFinder implements TagSuggestionWindow.TagFinder {
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
        "rest", "graphql", "websocket", "oauth", "jwt", "jsonwebtokens", "auth0", "passportjs", "security", "encryption"
    ];

    async find(predicate: string): Promise<string[]> {
        if ( predicate === "" ){
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

async function lag(ms: number){
    return new Promise( resolve => {
        setTimeout(() => { resolve(null) },ms)
    })
}

it("BkmkPredicateInputBox",async () => {
    const commandEmiter = new CommandEmiterCore()

    {
        let elm = new BkmkPredicateInputBox(
            new SampleTagFinder(),
            commandEmiter
        )
        
        expect(Array.from(elm.getPredicate().tags())).toEqual([])
        
        ;(elm as any).elm.inputbox.value = "a"
        ;(elm as any).elm.inputbox.dispatchEvent(new Event("input"))
        await lag(10)
        ;(elm as any).elm.inputbox.dispatchEvent(new KeyboardEvent("keydown",{ key: "Enter"} ))
        expect(Array.from(elm.getPredicate().tags())).toEqual(["ai"])

        ;(elm as any).elm.inputbox.value = "a"
        ;(elm as any).elm.inputbox.dispatchEvent(new Event("input"))
        await lag(10)
        ;(elm as any).elm.inputbox.dispatchEvent(new KeyboardEvent("keydown",{ key: "Enter"} ))
        expect(Array.from(elm.getPredicate().tags())).toEqual(["ai","angular"])

        ;(elm as any).elm.inputbox.value = "a"
        ;(elm as any).elm.inputbox.dispatchEvent(new Event("input"))
        await lag(10)
        ;(elm as any).elm.inputbox.dispatchEvent(new KeyboardEvent("keydown",{ key: "Enter"} ))
        expect(Array.from(elm.getPredicate().tags())).toEqual(["ai","angular","api"])
        

        ;(elm as any).elm.inputbox.dispatchEvent(new Event("input"))
        await lag(10)
        ;(elm as any).elm.inputbox.dispatchEvent(new KeyboardEvent("keydown",{ key: "Enter"} ))
        expect(Array.from(elm.getPredicate().tags())).toEqual(["ai","angular","api"])
    }
})