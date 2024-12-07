
import Database from '@tauri-apps/plugin-sql';

import { TagSuggestionWindow } from "../Elements/TagSuggestionWindow/TagSuggestionWindow";
import { BkmkCreater } from '../Elements/CreateNewBkmk/lib';
import { Assert } from '../common/Assert';
import { BkmkFinder, BookmarkRemover } from '../Elements/ScreenRoot/lib';
import { BkmkList } from '../Elements/BkmkList/lib';
import { BkmkPredicate } from '../Elements/BkmkPredicateInputBox/BkmkPredicateInputBox';

/**
 * 使う時は寿命について意識してくれ
 */
export class DbConnection {
    static async connect(){
        return new DbConnection(
            await Database.load("sqlite:skin.db")
        )
    }

    private constructor(
        private db: Database
    ){ }
    
    /**
     * TODO 今だけ
     */
    debbugging(){
        console.warn("デバッグ用のコード")
        return new DebuggingDb(this.db)    
    }

    tagFinder(): TagSuggestionWindow.TagFinder {
        return new FindTagFromDb(this.db)
    }
    
    bkmkCreater(): BkmkCreater {
        return new InsertBkmkIntoDb(this.db)
    }
    
    bkmkFinder(): BkmkFinder {
        return new FindBkmkFromDb(this.db)
    }
    
    bkmkRemover(): BookmarkRemover {
        return new BookmarkRemoverImplement(this.db)
    }
}

class BkmkData implements BkmkList.ItemData {
    record: BkmkRecord
    tags: string[]
    constructor(arg: {
        record: BkmkRecord,
        tags: string[]
    }){
        this.record = arg.record
        this.tags = arg.tags
    }

    getTitle(): string {
        return this.record.title
    }
    getUrl(): string {
        return this.record.url
    }
    getTags(): string[] {
        return [...this.tags]
    }
    getDesc(): string {
        return this.record.description
    }
    getId(): number {
        return this.record.id
    }
}

type BkmkRecord = {
    id: number
    title: string
    url: string
    description: string
    tag_count: number
}

class FindBkmkFromDb implements BkmkFinder {
    constructor(
        private db: Database
    ){}

    async find(predicate: BkmkPredicate): Promise<BkmkList.ItemData[]> {
        if ( predicate.isEmpty() ){
            return []
        }

        const tags = predicate.tags()
        let stmt = Array(tags.size).fill(0).map((_,i) => `$${i + 1}`).join(",")

        const query = `
        SELECT b.*
        FROM bookmarks b
        JOIN tag_map tm ON b.id = tm.bkmk_id
        JOIN tags t ON tm.tag_id = t.id
        WHERE t.name IN (${stmt})
        GROUP BY b.id
        HAVING COUNT(DISTINCT t.name) = ${tags.size}
        ORDER BY b.tag_count ASC
        ;`
        
        let result = await this.db.select(query,Array.from(tags)) as BkmkRecord[]
        let result2 = await Promise.all(result.map( async record => {
            let tags = await this.tags(record.id)
            return {
                record,
                tags
            }
        }))
        return result2.map( r => new BkmkData(r) )
    }
    

    private async tags(bkmkid: number): Promise<string[]>{
        const query = `
            SELECT tags.name
            FROM tags
            JOIN tag_map ON tags.id = tag_map.tag_id
            WHERE tag_map.bkmk_id = $1;`
        
        let result = await this.db.select(query,[bkmkid])
    
        // @ts-ignore
        return result.map( r => r.name)
    }
}

class FindTagFromDb implements TagSuggestionWindow.TagFinder {
    constructor(
        private db: Database
    ){}

    async find(predicate: string): Promise<string[]> {
        let result1 = await this.db.select("select name from tags where name like $1 order by length(name)",[`${predicate}%`]) as any[]
        let result2 = await this.db.select("select name from tags where name like $1 and name not like $2 order by length(name)",[`%${predicate}%`,`${predicate}%`]) as any[]
        let result = [...result1,...result2]
        return result.map((record) => record.name)
    }
}

class InsertBkmkIntoDb implements BkmkCreater {
    constructor(
        private db: Database
    ){}

    async create(title: string, url: string, desc: string, tags: Set<string>): Promise<boolean> {
        let result = await this.db.execute("insert into bookmarks values(null,$1,$2,$3,$4)",[
            title,
            url,
            desc,
            tags.size
        ])
        
        let bkmkId = result.lastInsertId
        Assert.isNotUndefined(bkmkId)
        
        await this.addTags(tags)
        let tagIds = await this.tagIds(tags)
        
        for (let i = 0; i < tagIds.length; i++) {
            await this.db.execute("insert into tag_map values (null,$1,$2)",[bkmkId,tagIds[i]])
        }
        
        return true
    }
    
    private async findTagId(tag: string): Promise<number> {
        let record = await this.db.select("select id from tags where name = $1",[tag])
        // @ts-ignore
        return record[0].id
    }

    private async tagIds(tags: Set<string>){
        let tagsAry = Array.from(tags)
        Assert.isTrue( tagsAry.length > 0)
        let tagIds: number[] = []
        for (let i = 0; i < tagsAry.length; i++) {
            tagIds.push(await this.findTagId(tagsAry[i]))
        }
        return tagIds
    }

    private async addTags(tags: Set<string>){
        let tagsAry = Array.from(tags)
        for (let i = 0; i < tagsAry.length; i++) {
            await this.ifNotEixstsThenInsertTag(tagsAry[i])
        }
    }

    private async isExistsTag(tag: string){
        let result = await this.db.select("select * from tags where name = $1",[tag]) as any[]
        return result.length >= 1
    }

    private async ifNotEixstsThenInsertTag(tag: string){
        if ( await this.isExistsTag(tag) ){
            return
        }
        
        await this.db.execute("insert into tags values (null,$1)",[tag])
    }
}

class DebuggingDb {
    constructor(
        private db: Database
    ){}

    private async isExistsTag(tag: string){
        let result = await this.db.select("select * from tags where name = $1",[tag]) as any[]
        return result.length >= 1
    }

    async ifNotEixstsThenInsertTag(tag: string){
        if ( await this.isExistsTag(tag) ){
            return
        }
        
        await this.db.execute("insert into tags values (null,$1)",[tag])
    }
}


class BookmarkRemoverImplement implements BookmarkRemover {
    constructor(
        private db: Database
    ){}

    async remove(bkmkid: number): Promise<void> {
        await this.db.execute("delete from tag_map where bkmk_id = $1",[bkmkid])
        await this.db.execute("delete from bookmarks where id = $1",[bkmkid])
    }
}