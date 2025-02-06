// import Database from "@tauri-apps/plugin-sql";
import { invoke } from "@tauri-apps/api/core";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

// TODO:エラーを通知する

export namespace DB {
    export async function insertBookmark(
        title: string,
        url: string,
        desc: string,
        tags: string[]
    ): Promise<void> {
        return await invoke<void>("insert_bookmark", { req: { title, url, desc, tags } })
            .catch((e) => { throw e })
    }

    export async function editBookmark(
        id: number,
        title: string,
        url: string,
        desc: string,
        tags: string[]
    ): Promise<void> {
        return await invoke("edit_bookmark", { req: { id, title, url, desc, tags } })
    }

    export async function getBookmark(id: number): Promise<Bookmark> {
        return await invoke<Bookmark>("get_bookmark", { id })
    }

    export async function findTag(predicate: string): Promise<string[]> {
        return await invoke<string[]>("find_tag", { predicate })
            .catch((e) => { throw e })
    }

    export async function deleteBookmark(id: number): Promise<void> {
        return await invoke<void>("delete_bookmark", { bookmarkId: id })
            .catch((e) => { throw e })
    }

    export async function fetchBookmarks(maxLength: number): Promise<Bookmark[]> {
        return await invoke<Bookmark[]>("fetch_bookmarks", { maxLength })
            .catch((e) => { throw e })
    }

    export async function isExistsTag(tag: string) {
        return await invoke<boolean>("is_exists_tag", { tag: tag })
            .catch((e) => { throw e })
    }

    export async function findBookmark(filterTags: string[]): Promise<Bookmark[]> {
        return await invoke<Bookmark[]>("find_bookmark", { filterTags })
            .catch((e) => { throw e })
    }

    export async function fuzzyFindTag(predicate: string) {
        return await invoke<[string, boolean][][]>("fuzzy_find_tag", { predicate })
    }
}