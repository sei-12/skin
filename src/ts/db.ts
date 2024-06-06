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
    `)
}


export namespace DbAPI {
    
    export type TagsRecord = {
        tag_id: number
        value: string
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