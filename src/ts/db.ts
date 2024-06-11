import { appDataDir } from '@tauri-apps/api/path';
import SQLite from 'tauri-plugin-sqlite-api';
import { Store } from "tauri-plugin-store-api";

let g_sqlite: SQLite | null = null
let g_store: Store | null = null


async function initDb(){
    if ( g_sqlite === null || g_store === null) {
        throw Error("bug")
    }
    
    await g_sqlite.execute(`
        create table tags (
            tag_id integer primary key,
            value varchar(32) not null unique
        );
        
        create table bkmks (
            bkmk_id integer primary key,
            url text not null unique,
            desc text not null,
            title text not null
        );
        
        create table tag_links (
            tag_id integer not null,
            bkmk_id integer not null,
            FOREIGN KEY(tag_id) REFERENCES tags(tag_id),
            FOREIGN KEY(bkmk_id) REFERENCES bkmks(bkmk_id)
        );
    `)
}


export namespace DbAPI {
    
    export type TagsRecord = {
        tag_id: number
        value: string
    }
    
    export type BkmksRecord = {
        bkmk_id: number
        url: string
        desc: string
        title: string
    }

    export async function connect() {
        if (g_sqlite !== null || g_store !== null) {
            return true
        }

        let appDataDirPath = await appDataDir()
        const db = await SQLite.open(appDataDirPath + '/data.sqlite').catch(err => {console.error(err); return null })
        const store = new Store("./data.store")

        if (db === null) {
            return false
        }

        const initialized = await store.get<boolean>("initialized")

        g_sqlite = db
        g_store = store

        if ( initialized === false || initialized === null ){
            try {
                await initDb()
                await g_store.set("initialized",true)
                await g_store.save()
                console.log("aaa")
            }catch(err){
                console.error("データベースの初期化に失敗しました")
                console.error(err)            
                // await store.set("initialized",false)
                return false
            }
        }
        

        return true
    }
    
    export async function insertNewTag(tag: string): Promise<boolean> {
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();
        
        let result = await g_sqlite.execute("insert into tags values (null,?)",[tag])
        
        return result
    }
    
    export async function existsTag(tag: string){
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();
        let result = await g_sqlite.select("select count(*) as c from tags where value = ?",[tag])
        // @ts-ignore
        return result[0].c !== 0
    }

    /**
     * 異常が起きる例
     * - URLが重複していた場合
     * 
     * falseがかえる場合、DBには一切変更が加えられていない。
     *
     * @param title 
     * @param url 
     * @param desc 
     * @param tags 存在しないタグが含まれていてもOK。こちら側で追加する。 
     * 
     * @returns 正常に追加できた場合はtrue.
     */
    export async function createNewBkmk(
        title: string,
        url: string,
        desc: string,
        tags: string[]
    ){
        // トランジションを開始する？
        
        await insertTagIfNotExists(tags)
        console.log("hello")
        let res = insertNewBkmk(url,title,desc)
        if ( !res ){
            return false
        }
        
        let lastInsertBkmkId = (await getLastInsertBkmk()).bkmk_id
        let tagIds = (await selectTags(tags)).map( tag => tag.tag_id )

        for (let i = 0; i < tagIds.length; i++) {
            let tagId = tagIds[i]
            let result = await insertTagLink(lastInsertBkmkId,tagId)
            if ( !result ){
                return false
            }
        }
        
        return true
    }
    
    async function insertTagLink(bkmk_id: number, tag_id: number) {
        if ( g_sqlite === null || g_store === null ) throw Error();
        return await g_sqlite.execute("insert into tag_links values (?,?)",[tag_id,bkmk_id])
    }
    
    async function selectTags(tagValues: string[]): Promise<TagsRecord[]>{
        if ( tagValues.length === 0 ){
            return []
        }

        let query = `select * from tags where ` + tagValues.map(v => `value = "${v}"`).join(" or ")

        if ( g_sqlite === null || g_store === null ) throw Error();
        let result = await g_sqlite.select(query)
        // @ts-ignore
        return result
    }
    
    async function getLastInsertBkmk():Promise<BkmksRecord> {
        if ( g_sqlite === null || g_store === null ) throw Error();
        let result = await g_sqlite.select("select * from bkmks where bkmk_id = last_insert_rowid();")
        // @ts-ignore
        return result[0]
    }
    
    
    async function insertNewBkmk(url: string, title: string, desc: string) {
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();
        
        let result = await g_sqlite.execute("insert into bkmks values (null,?,?,?)",[url,desc,title])
        
        // @ts-check
        return result
    }
    
    export async function existsBkmkWhereURL(url: string):Promise<boolean> {
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();
        let result = await g_sqlite.select("select * from bkmks where url = ?",[url])
        console.log(url,result)
        // @ts-ignore
        return result.length !== 0
    }
    // ------------------------------------------------------------------------
    // ここより下
    // 効率悪いけど、どうせ大丈夫だし気にすんな！！！！
    // って感じ
    // ------------------------------------------------------------------------

    async function insertTagIfNotExists(tags: string[]){
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            if ( await existsTag(tag) ){
                continue
            }
            await insertNewTag(tag)
        }
    }

    export async function selectTagSuggestion(input: string):Promise<TagsRecord[]> {
        connect()
        if ( g_sqlite === null || g_store === null ) throw Error();

        // unionを使えば一つのSQLでできると思うんやけど、、望むような順番にするためにどうすればいいのかわからんからTS側で処理する
        let result = await g_sqlite.select( ` select * from tags where value like ? order by length(value)`,[input+"%"])
        let result2 = await g_sqlite.select("select * from tags where value like ? and value not like ? order by length(value);",["%"+input+"%",input+"%"])
        
        // @ts-ignore
        return result.concat(result2)
    }
}