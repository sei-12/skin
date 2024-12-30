import { test, vi } from "vitest";
import { DB } from "./database";

// const testData = {
//     bookmarks: [
//         {
//             id: 1,
//             title: "Example",
//             url: "https://example.com",
//             desc: "An example bookmark",
//             tags: ["example", "test"],
//         },
//         {
//             id: 2,
//             title: "Vitest Docs",
//             url: "https://vitest.dev",
//             desc: "Testing framework documentation",
//             tags: ["testing", "documentation"],
//         },
//     ],
//     tags: ["example", "test", "testing", "documentation"],
// };


export function startMockDB() {
    // モック化するメソッドの一覧
    vi.spyOn(DB, "deleteBookmark").mockImplementation(async (id: number) => {
        console.log(`Mocked deleteBookmark called with id: ${id}`);
    });

    vi.spyOn(DB, "insertBookmark").mockImplementation(async (title: string, url: string, desc: string, tags: string[]) => {
        console.log(`Mocked insertBookmark called with title: ${title}, url: ${url}, desc: ${desc}, tags: ${tags}`);
    });

    // vi.spyOn(DB, "insertTag").mockImplementation(async (tag: string) => {
    //     console.log(`Mocked insertTag called with tag: ${tag}`);
    // });

    vi.spyOn(DB, "isExistsTag").mockImplementation(async (tag: string) => {
        console.log(`Mocked isExistsTag called with tag: ${tag}`);
        return tag === "example"; // テスト用に特定のタグを存在するとする
    });

    vi.spyOn(DB, "findBookmark").mockImplementation(async (tags: string[]) => {
        console.log(`Mocked findBookmark called with tags: ${tags}`);
        return [
            {
                id: 1,
                title: "Example",
                url: "https://example.com",
                desc: "An example bookmark",
                tags: ["example", "test"],
            },
        ]; // サンプルデータを返す
    });

    vi.spyOn(DB, "findTag").mockImplementation(async (predicate: string) => {
        console.log(`Mocked findTag called with predicate: ${predicate}`);
        return ["example", "test", "testing"]; // サンプルデータを返す
    });
}

test("")