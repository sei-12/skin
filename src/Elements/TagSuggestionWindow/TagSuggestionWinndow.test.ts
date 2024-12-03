import { expect, it } from "vitest";
import { TagSuggestionWindow } from "./TagSuggestionWindow";
import { CommandId, I_CommandEmmiter } from "../../lib/CommandEmmiter";
import { EmiterCore, EmiterLisntener } from "../../lib/EmiterCore";
// import { TagSuggestionWindow } from "./TagSuggestionWindow";


/**
 * TagFinderインターフェースを実装したクラス
 */
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

class SampleCommandEmiter implements I_CommandEmmiter {
    addWeakRefListener(listener: EmiterLisntener<CommandId>): void {
        this.core.addWeakRefLisntener(listener)
    }
    emit(commandId: CommandId){
        this.core.emit(commandId)
    }
    private core = new EmiterCore<CommandId>()
}

it("TagSuggestionWindow",async () => {
    const emiter = new SampleCommandEmiter()
    {
        const elm = new TagSuggestionWindow.Element(
            new SampleTagFinder(),
            emiter
        )
        
        await elm.update("a")
        expect(elm.getFocused()).toBe("ai")
        emiter.emit("tagSuggestionWindow.focusDown")
        expect(elm.getFocused()).toBe("angulr")
        emiter.emit("tagSuggestionWindow.focusDown")
        expect(elm.getFocused()).toBe("api")
        emiter.emit("tagSuggestionWindow.focusDown")
        expect(elm.getFocused()).toBe("auth0")
    }

    {
        const elm = new TagSuggestionWindow.Element(
            new SampleTagFinder(),
            emiter
        )
        
        expect(elm.getFocused()).toBe(null)
        await elm.update("")
        expect(elm.getFocused()).toBe(null)
        await elm.update("hellloooooo")
        expect(elm.getFocused()).toBe(null)
        await elm.update("a")
        expect(elm.getFocused()).toBe("ai")
        await elm.update("hellloooooo")
        expect(elm.getFocused()).toBe(null)
        await elm.update("a")
        emiter.emit("tagSuggestionWindow.focusUp")
        expect(elm.getFocused()).toBe("yaml")
    }
    
    {
        async function snapshottest(predicate: string){
            await elm.update(predicate)
            expect(elm.getFocused()).toMatchSnapshot()
        }

        const elm = new TagSuggestionWindow.Element(
            new SampleTagFinder(),
            emiter
        )
        
        await snapshottest("hello")
        await snapshottest("aaa")
        await snapshottest("g")
        await snapshottest("main")
    }

    {
        async function snapshottest(predicate: string, n: number){
            await elm.update(predicate)
            Array(n).fill(0).forEach(_ => {
                emiter.emit("tagSuggestionWindow.focusUp")
            })
            expect(elm.getFocused()).toMatchSnapshot()
        }

        const elm = new TagSuggestionWindow.Element(
            new SampleTagFinder(),
            emiter
        )
        
        await snapshottest("hello",100)
        await snapshottest("aaa",10)
        await snapshottest("g",2)
        await snapshottest("main",40)
    }

    {
        async function snapshottest(predicate: string, n: number){
            await elm.update(predicate)
            Array(n).fill(0).forEach(_ => {
                emiter.emit("tagSuggestionWindow.focusDown")
            })
            expect(elm.getFocused()).toMatchSnapshot()
        }

        const elm = new TagSuggestionWindow.Element(
            new SampleTagFinder(),
            emiter
        )
        
        await snapshottest("hello",100)
        await snapshottest("aaa",10)
        await snapshottest("g",2)
        await snapshottest("main",40)
        await snapshottest("a",100)
        await snapshottest("b",10)
        await snapshottest("c",2)
        await snapshottest("d",403)
    }
})