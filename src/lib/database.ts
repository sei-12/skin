import Database from "@tauri-apps/plugin-sql";
import type { IData } from "../dts/data";

class DbInner {
    private db: Promise<Database>
    constructor(path: string) {
        this.db = Database.load(path)
    }

    async select<T>(query: string, bindValues?: unknown[]): Promise<T> {
        const db = await this.db
        return db.select(query, bindValues)
    }

    async execute(query: string, bindValues?: unknown[]) {
        const db = await this.db
        return await db.execute(query, bindValues)
    }
}

class DataBaseConnection implements IDataBase {

    private db: DbInner
    constructor() {
        this.db = new DbInner("sqlite:skin.db")
    }

    private async findTagId(tag: string): Promise<number> {
        const record = await this.db.select<{id: number}[]>("select id from tags where name = $1", [tag])
        return record[0].id
    }

    private async tagIds(tags: Set<string>) {
        const tagsAry = Array.from(tags)
        // Assert.isTrue( tagsAry.length > 0)
        const tagIds: number[] = []
        for (let i = 0; i < tagsAry.length; i++) {
            tagIds.push(await this.findTagId(tagsAry[i]))
        }
        return tagIds
    }

    private async addTags(tags: Set<string>) {
        const tagsAry = Array.from(tags)
        for (let i = 0; i < tagsAry.length; i++) {
            await this.ifNotEixstsThenInsertTag(tagsAry[i])
        }
    }

    async isExistsTag(tag: string) {
        const result = await this.db.select<{id: number}[]>("select * from tags where name = $1", [tag])
        return result.length >= 1
    }

    private async ifNotEixstsThenInsertTag(tag: string) {
        if (await this.isExistsTag(tag)) {
            return
        }

        await this.db.execute("insert into tags values (null,$1)", [tag])
    }

    async insertBookmark(title: string, url: string, desc: string, tags: string[]): Promise<void> {
        console.log(title, url, desc, tags)

        const result = await this.db.execute("insert into bookmarks values(null,$1,$2,$3,$4)", [
            title,
            url,
            desc,
            tags.length
        ])

        console.log(result)

        const bkmk_id = result.lastInsertId

        if (bkmk_id === undefined) {
            // TODO: もっといい書き方を考えた方がいいのではなかろうか
            // insertしたデータを削除した方がいいと思う
            console.warn("arienaihazu")
            return
        }

        const bkmkId = result.lastInsertId

        const tagsSet = new Set(tags)
        await this.addTags(tagsSet)
        const tagIds = await this.tagIds(tagsSet)

        for (let i = 0; i < tagIds.length; i++) {
            await this.db.execute("insert into tag_map values (null,$1,$2)", [bkmkId, tagIds[i]])
        }

        return
    }

    async deleteBookmark(id: number): Promise<void> {
        await this.db.execute("delete from tag_map where bkmk_id = $1", [id])
        await this.db.execute("delete from bookmarks where id = $1", [id])
    }

    async insertTag(tag: string): Promise<void> {
        if (await this.isExistsTag(tag)) {
            return
        }

        await this.db.execute("insert into tags values (null,$1)", [tag])
    }

    async findBookmark(tags: string[]): Promise<IData.Bookmark[]> {
        // if ( tags.length === 0 ){
        // 	return []
        // }

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

        const result = await this.db.select(query, Array.from(tags)) as BkmkRecord[]
        const result2 = await Promise.all(result.map(async record => {
            const tags = await this.selectTagsFromTagMap(record.id)
            return {
                record,
                tags
            }
        }))
        return result2.map(r => new BkmkData(r))
    }

    private async selectTagsFromTagMap(bkmkid: number): Promise<string[]> {
        const query = `
            SELECT tags.name
            FROM tags
            JOIN tag_map ON tags.id = tag_map.tag_id
            WHERE tag_map.bkmk_id = $1;`

        const result = await this.db.select<{name: string}[]>(query, [bkmkid])
        return result.map(r => r.name)
    }

    async findTag(predicate: string): Promise<string[]> {
        if (predicate === "") {
            return []
        }
        const result1 = await this.db.select<{name: string}[]>("select name from tags where name like $1 order by length(name)", [`${predicate}%`])
        const result2 = await this.db.select<{name: string}[]>("select name from tags where name like $1 and name not like $2 order by length(name)", [`%${predicate}%`, `${predicate}%`])
        const result = [...result1, ...result2]
        return result.map((record) => record.name)
    }
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

export const dbConnection: IDataBase = new DataBaseConnection()