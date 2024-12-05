
import Database from '@tauri-apps/plugin-sql';

import { TagSuggestionWindow } from "../Elements/TagSuggestionWindow/TagSuggestionWindow";

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