import Database from "@tauri-apps/plugin-sql";
import { IData } from "../dts/data";

class DbInner {
    private db: Promise<Database>
    constructor(path: string) {
        this.db = Database.load(path)
    }

    async select<T>(query: string, bindValues?: unknown[]): Promise<T> {
        let db = await this.db
        return db.select(query, bindValues)
    }

    async execute(query: string, bindValues?: unknown[]) {
        let db = await this.db
        return await db.execute(query, bindValues)
    }
}

class DataBaseConnection implements IDataBase {

    private db: DbInner
    constructor() {
        this.db = new DbInner("sqlite:skin.db")
    }

    private async findTagId(tag: string): Promise<number> {
        let record = await this.db.select("select id from tags where name = $1", [tag])
        // @ts-ignore
        return record[0].id
    }

    private async tagIds(tags: Set<string>) {
        let tagsAry = Array.from(tags)
        // Assert.isTrue( tagsAry.length > 0)
        let tagIds: number[] = []
        for (let i = 0; i < tagsAry.length; i++) {
            tagIds.push(await this.findTagId(tagsAry[i]))
        }
        return tagIds
    }

    private async addTags(tags: Set<string>) {
        let tagsAry = Array.from(tags)
        for (let i = 0; i < tagsAry.length; i++) {
            await this.ifNotEixstsThenInsertTag(tagsAry[i])
        }
    }

    async isExistsTag(tag: string) {
        let result = await this.db.select("select * from tags where name = $1", [tag]) as any[]
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

        let result = await this.db.execute("insert into bookmarks values(null,$1,$2,$3,$4)", [
            title,
            url,
            desc,
            tags.length
        ])

        console.log(result)

        let bkmk_id = result.lastInsertId

        if (bkmk_id === undefined) {
            // TODO: もっといい書き方を考えた方がいいのではなかろうか
            // insertしたデータを削除した方がいいと思う
            console.warn("arienaihazu")
            return
        }

        let bkmkId = result.lastInsertId

        let tagsSet = new Set(tags)
        await this.addTags(tagsSet)
        let tagIds = await this.tagIds(tagsSet)

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

        let stmt = Array(tags.length).fill(0).map((_, i) => `$${i + 1}`).join(",")

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

        let result = await this.db.select(query, Array.from(tags)) as BkmkRecord[]
        let result2 = await Promise.all(result.map(async record => {
            let tags = await this.selectTagsFromTagMap(record.id)
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

        let result = await this.db.select(query, [bkmkid])

        // @ts-ignore
        return result.map(r => r.name)
    }

    async findTag(predicate: string): Promise<string[]> {
        if (predicate === "") {
            return []
        }
        let result1 = await this.db.select("select name from tags where name like $1 order by length(name)", [`${predicate}%`]) as any[]
        let result2 = await this.db.select("select name from tags where name like $1 and name not like $2 order by length(name)", [`%${predicate}%`, `${predicate}%`]) as any[]
        let result = [...result1, ...result2]
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