
import Database from '@tauri-apps/plugin-sql';

import { TagSuggestionWindow } from "../Elements/TagSuggestionWindow/TagSuggestionWindow";
import { BkmkCreater } from '../Elements/CreateNewBkmk/lib';
import { Assert } from '../common/Assert';

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