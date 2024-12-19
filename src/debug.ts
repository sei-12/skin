// import Database from "@tauri-apps/plugin-sql"
// import { IData } from "./data"

// const TAG_LIST = [
//     "typescript", "javascript", "python", "java", "csharp", "ruby", "php", "swift", "kotlin", "golang",
//     "rust", "scala", "haskell", "perl", "sql", "html", "css", "sass", "less", "json", "gist", "clang", "cpp",
//     "xml", "yaml", "docker", "kubernetes", "aws", "azure", "gcp", "firebase", "react", "vue",
//     "angular", "svelte", "jquery", "nodejs", "express", "nestjs", "deno", "nextjs", "nuxtjs", "remix",
//     "webpack", "rollup", "vite", "babel", "eslint", "prettier", "jest", "mocha", "chai", "vitest",
//     "playwright", "puppeteer", "selenium", "cypress", "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins",
//     "travis", "circleci", "databases", "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "oracle",
//     "machinelearning", "ai", "deeplearning", "nlp", "opencv", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
//     "numpy", "matplotlib", "seaborn", "debugging", "logging", "profiling", "performance", "optimizations", "http", "api",
//     "rest", "graphql", "websocket", "oauth", "jwt", "jsonwebtokens", "auth0", "passportjs", "security", "encryption", "hello", "main"
// ] as const;

// export async function debugMain(){
//     console.warn("dubug")
//     const db = new DebugDb()
    
//     await Promise.all( TAG_LIST.map(async tag => {
//         await db.ifNotEixstsThenInsertTag(tag)        
//     }))
// }

// class DbInner {
// 	private db: Promise<Database>
// 	constructor(path: string){
// 		this.db = Database.load(path)
// 	}
	
//     async select<T>(query: string, bindValues?: unknown[]): Promise<T> {
//         let db = await this.db
//         return db.select(query,bindValues)
//     }
	
//     async execute(query: string, bindValues?: unknown[]) {
//         let db = await this.db
//         return await db.execute(query,bindValues)
//     }
// }

// export class DebugDb {
// 	private db: DbInner
// 	constructor(){
// 		this.db = new DbInner("sqlite:skin.db")
// 	}
		
// 	async insertBookmark(data: IData.Bookmark): Promise<void> {
//         let result = await this.db.execute("insert into bookmarks values(null,$1,$2,$3,$4)",[
//             data.title,
//             data.url,
//             data.desc,
//             data.tags.length
//         ])
		
// 		let bkmk_id = result.lastInsertId

// 		if ( bkmk_id === undefined ){
// 			// TODO: もっといい書き方を考えた方がいいのではなかろうか
// 			// insertしたデータを削除した方がいいと思う
// 			console.warn("arienaihazu")
// 			return
// 		}

//         let bkmkId = result.lastInsertId
        
// 		let tagsSet = new Set(data.tags)
//         await this.addTags(tagsSet)
//         let tagIds = await this.tagIds(tagsSet)
        
//         for (let i = 0; i < tagIds.length; i++) {
//             await this.db.execute("insert into tag_map values (null,$1,$2)",[bkmkId,tagIds[i]])
//         }
        
//         return
// 	}

//     private async tagIds(tags: Set<string>){
//         let tagsAry = Array.from(tags)
//         // Assert.isTrue( tagsAry.length > 0)
//         let tagIds: number[] = []
//         for (let i = 0; i < tagsAry.length; i++) {
//             tagIds.push(await this.findTagId(tagsAry[i]))
//         }
//         return tagIds
//     }

//     private async addTags(tags: Set<string>){
//         let tagsAry = Array.from(tags)
//         for (let i = 0; i < tagsAry.length; i++) {
//             await this.ifNotEixstsThenInsertTag(tagsAry[i])
//         }
//     }

//     async isExistsTag(tag: string){
//         let result = await this.db.select("select * from tags where name = $1",[tag]) as any[]
//         return result.length >= 1
//     }

//     async ifNotEixstsThenInsertTag(tag: string){
//         if ( await this.isExistsTag(tag) ){
//             return
//         }
        
//         await this.db.execute("insert into tags values (null,$1)",[tag])
//     }

//     private async findTagId(tag: string): Promise<number> {
//         let record = await this.db.select("select id from tags where name = $1",[tag])
//         // @ts-ignore
//         return record[0].id
//     }
// }