import Database from "@tauri-apps/plugin-sql";
import type { IData } from "../dts/data";

/**
 * MEMO: 確かプラグイン側でコネクションプールが実装されているのでDatabase.loadの実行コストは低いはず。
 *
 */
async function getConnection() {
    return Database.load("sqlite:skin.db")
}

export namespace DB {
    export async function insertBookmark(title: string, url: string, desc: string, tags: string[]) {
        const con = await getConnection()
        const result = await con.execute("insert into bookmarks values(null,$1,$2,$3,$4)", [
            title,
            url,
            desc,
            tags.length
        ])

        const bkmk_id = result.lastInsertId
        if (bkmk_id === undefined) { return }

        const bkmkId = result.lastInsertId

        const tagsSet = new Set(tags)
        await addTags(tagsSet)
        const tagIds_res = await tagIds(tagsSet)

        for (let i = 0; i < tagIds.length; i++) {
            await con.execute("insert into tag_map values (null,$1,$2)", [bkmkId, tagIds_res[i]])
        }

        return
    }

    export async function findTag(predicate: string): Promise<string[]> {
        if (predicate === "") {
            return []
        }
        const con = await getConnection()
        const result1 = await con.select<{ name: string }[]>("select name from tags where name like $1 order by length(name)", [`${predicate}%`])
        const result2 = await con.select<{ name: string }[]>("select name from tags where name like $1 and name not like $2 order by length(name)", [`%${predicate}%`, `${predicate}%`])
        const result = [...result1, ...result2]
        return result.map((record) => record.name)
    }
    export async function deleteBookmark(id: number): Promise<void> {
        const con = await getConnection()
        await con.execute("delete from tag_map where bkmk_id = $1", [id])
        await con.execute("delete from bookmarks where id = $1", [id])
    }


    export async function isExistsTag(tag: string) {
        const con = await getConnection()
        const result = await con.select<{ id: number }[]>("select * from tags where name = $1", [tag])
        return result.length >= 1
    }

    export async function findBookmark(tags: string[]): Promise<IData.Bookmark[]> {
        const con = await getConnection()
        const stmt = Array(tags.length).fill(0).map((_, i) => `$${i + 1}`).join(",")

        const query = `
        SELECT b.*
        FROM bookmarks b
        JOIN tag_map tm ON b.id = tm.bkmk_id
        JOIN tags t ON tm.tag_id = t.id
        WHERE t.name IN (${stmt})
        GROUP BY b.id
        HAVING COUNT(DISTINCT t.name) = ${tags.length}
        ORDER BY b.tag_count ASC
        ;`

        const result = await con.select(query, Array.from(tags)) as BkmkRecord[]
        const result2 = await Promise.all(result.map(async record => {
            const tags = await selectTagsFromTagMap(record.id)
            return {
                record,
                tags
            }
        }))
        return result2.map(r => new BkmkData(r))
    }
}

async function selectTagsFromTagMap(bkmkid: number): Promise<string[]> {
    const query = `
        SELECT tags.name
        FROM tags
        JOIN tag_map ON tags.id = tag_map.tag_id
        WHERE tag_map.bkmk_id = $1;`

    
    const con = await getConnection()
    const result = await con.select<{ name: string }[]>(query, [bkmkid])
    return result.map(r => r.name)
}

async function addTags(tags: Set<string>) {
    const tagsAry = Array.from(tags)
    for (let i = 0; i < tagsAry.length; i++) {
        await ifNotEixstsThenInsertTag(tagsAry[i])
    }
}

async function ifNotEixstsThenInsertTag(tag: string) {
    const con = await getConnection()
    if (await DB.isExistsTag(tag)) { return }
    await con.execute("insert into tags values (null,$1)", [tag])
}


async function tagIds(tags: Set<string>) {
    const tagsAry = Array.from(tags)
    const tagIds: number[] = []
    for (let i = 0; i < tagsAry.length; i++) {
        tagIds.push(await findTagId(tagsAry[i]))
    }
    return tagIds
}

async function findTagId(tag: string): Promise<number> {
    const con = await getConnection()
    const record = await con.select<{ id: number }[]>("select id from tags where name = $1", [tag])
    return record[0].id
}



class BkmkData implements IData.Bookmark {
    record: BkmkRecord
    tags: string[]
    constructor(arg: {
        record: BkmkRecord,
        tags: string[]
    }) {
        this.record = arg.record
        this.tags = arg.tags

        this.id = this.record.id
        this.title = this.record.title
        this.desc = this.record.description
        this.url = this.record.url
    }

    id: number;
    title: string;
    desc: string;
    url: string;
}

type BkmkRecord = {
    id: number
    title: string
    url: string
    description: string
    tag_count: number
}

/**
 * テストなどで使う
 */
export interface IDataBase {
    insertBookmark(title: string, url: string, desc: string, tags: string[]): Promise<void>

    deleteBookmark(id: number): Promise<void>
    insertTag(tag: string): Promise<void>

    isExistsTag(tag: string): Promise<boolean>
    findBookmark(tags: string[]): Promise<IData.Bookmark[]>
    findTag(predicate: string): Promise<string[]>
}
