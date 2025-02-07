import { expect, test, vi } from "vitest";
import { DB } from "./database";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

export function startMockDB() {
    vi.spyOn(DB, "deleteBookmark").mockImplementation(async (id: number) => {
        // テストデータの数
        expect(0 <= id && id < testBookmarks.length).toBe(true)
    });

    vi.spyOn(DB, "insertBookmark").mockImplementation(async (title: string, url: string, desc: string, tags: string[]) => {
        expect(title !== "").toBe(true)
        expect(url !== "").toBe(true)
        expect(desc !== undefined).toBe(true)
        expect(tags.length !== 0).toBe(true)
    });

    vi.spyOn(DB, "isExistsTag").mockImplementation(async (tag: string) => {
        return testTags.includes(tag);
    });

    vi.spyOn(DB, "findBookmark").mockImplementation(async (tags: string[]) => {
        if (tags.length === 0) { return [] }
        let filted = testBookmarks

        tags.forEach(tag => {
            filted = filted.filter(b => b.tags.includes(tag))
        })

        return filted
    });

    vi.spyOn(DB, "findTag").mockImplementation(async (predicate: string) => {
        return testTags.filter(t => t.includes(predicate))
    });

    /**
     * 実装が面倒
     * テストするならそっちで書いて
     */
    vi.spyOn(DB, "fuzzyFindTag").mockImplementation(async (predicate: string) => {
        return testTags.filter(t => t.includes(predicate)).map(t => [[t, true]])
    })


    vi.spyOn(DB, "fetchBookmarks").mockImplementation(async (maxLength: number) => {
        return testBookmarks.slice(0, maxLength)
    })


    vi.spyOn(DB, "getBookmark").mockImplementation(async (id: number) => {
        return testBookmarks[id]
    })

    vi.spyOn(DB, "editBookmark").mockImplementation(async (
        id: number,
        title: string,
        url: string,
        desc: string,
        tags: string[]
    ) => {
        expect(title !== "").toBe(true)
        expect(url !== "").toBe(true)
        expect(desc !== undefined).toBe(true)
        expect(tags.length !== 0).toBe(true)
        expect(-1 < id && id < testBookmarks.length).toBe(true)
    })
}

test("")


const testTags = [
    "typescript", "javascript", "python", "java", "csharp", "ruby", "php", "swift", "kotlin", "golang",
    "rust", "scala", "haskell", "perl", "sql", "html", "css", "sass", "less", "json", "gist", "clang", "cpp",
]

const testBookmarks: Bookmark[] = [
    { id: 0, title: "hello0", desc: "d", url: "url", tags: ["less", "cpp", "rust", "javascript"], created_at: "2025-02-07" },
    { id: 1, title: "hello1", desc: "d", url: "url", tags: ["rust", "sass"], created_at: "2025-02-07" },
    { id: 2, title: "hello2", desc: "d", url: "url", tags: ["java", "ruby", "php", "java"], created_at: "2025-02-07" },
    { id: 3, title: "hello3", desc: "d", url: "url", tags: ["java", "css", "kotlin", "sass"], created_at: null },
    { id: 4, title: "hello4", desc: "d", url: "url", tags: ["cpp", "kotlin", "javascript", "less", "html"], created_at: "2025-02-07" },
    { id: 5, title: "hello5", desc: "d", url: "url", tags: ["scala", "perl", "java", "json", "csharp"], created_at: null },
    { id: 6, title: "hello6", desc: "d", url: "url", tags: ["java", "haskell"], created_at: "2025-02-07" },
    { id: 7, title: "hello7", desc: "d", url: "url", tags: ["cpp", "css", "javascript", "rust", "json"], created_at: "2025-02-07" },
    { id: 8, title: "hello8", desc: "d", url: "url", tags: ["typescript", "clang", "haskell", "html"], created_at: null },
    { id: 9, title: "hello9", desc: "d", url: "url", tags: ["java"], created_at: "2025-02-07" },
    { id: 10, title: "hello10", desc: "d", url: "url", tags: ["swift"], created_at: null },
    { id: 11, title: "hello11", desc: "d", url: "url", tags: ["clang"], created_at: null },
    { id: 12, title: "hello12", desc: "d", url: "url", tags: ["ruby", "typescript", "haskell", "json", "sql"], created_at: "2025-02-07" },
    { id: 13, title: "hello13", desc: "d", url: "url", tags: ["swift"], created_at: "2025-02-07" },
    { id: 14, title: "hello14", desc: "d", url: "url", tags: ["kotlin", "haskell", "ruby", "typescript", "ruby"], created_at: "2025-02-07" },
    { id: 15, title: "hello15", desc: "d", url: "url", tags: ["gist"], created_at: "2025-02-07" },
    { id: 16, title: "hello16", desc: "d", url: "url", tags: ["swift", "clang"], created_at: "2025-02-07" },
    { id: 17, title: "hello17", desc: "d", url: "url", tags: ["html", "ruby", "rust", "ruby"], created_at: "2025-02-07" },
    { id: 18, title: "hello18", desc: "d", url: "url", tags: ["php", "sql", "python", "typescript"], created_at: "2025-02-07" },
    { id: 19, title: "hello19", desc: "d", url: "url", tags: ["html", "rust", "kotlin", "haskell"], created_at: "2025-02-07" },
]