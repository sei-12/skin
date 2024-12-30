import { test, vi } from "vitest";

const testData = {
    bookmarks: [
        {
            id: 1,
            title: "Example",
            url: "https://example.com",
            desc: "An example bookmark",
            tags: ["example", "test"],
        },
        {
            id: 2,
            title: "Vitest Docs",
            url: "https://vitest.dev",
            desc: "Testing framework documentation",
            tags: ["testing", "documentation"],
        },
    ],
    tags: ["example", "test", "testing", "documentation"],
};


export function mockDatabase() {
    return () => ({
        dbConnection: {
            insertBookmark: vi.fn(async (title, url, desc, tags) => {
                const newBookmark = {
                    id: testData.bookmarks.length + 1,
                    title,
                    url,
                    desc,
                    tags,
                };
                testData.bookmarks.push(newBookmark);
            }),

            deleteBookmark: vi.fn(async (id) => {
                testData.bookmarks = testData.bookmarks.filter(
                    (bookmark) => bookmark.id !== id
                );
            }),

            insertTag: vi.fn(async (tag) => {
                if (!testData.tags.includes(tag)) {
                    testData.tags.push(tag);
                }
            }),

            isExistsTag: vi.fn(async (tag) => {
                return testData.tags.includes(tag);
            }),

            findBookmark: vi.fn(async (tags) => {
                return testData.bookmarks.filter((bookmark) =>
                    tags.every((tag: string) => bookmark.tags.includes(tag))
                );
            }),

            findTag: vi.fn(async (predicate) => {
                return testData.tags.filter((tag) => tag.includes(predicate));
            }),
        },
    })
}

test("")