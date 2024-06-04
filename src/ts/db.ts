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
            tab_id integer primary key,
            value varchar(32) not null unique
        );
    `)
}


export namespace DbAPI {
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
        if ( g_sqlite === null || g_store === null ) throw Error();
        
        let result = await g_sqlite.execute("insert into tags values (null,?)",[tag])
        
        return result
    }
    
    export async function existsTag(tag: string){
        if ( g_sqlite === null || g_store === null ) throw Error();
        let result = await g_sqlite.select("select count(*) as c from tags where value = ?",[tag])
        // @ts-ignore
        return result[0].c !== 0
    }
}