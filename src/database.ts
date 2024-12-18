import { IData } from "./data";

export class DataBase implements IDataBase {
	
	
}

/**
 * テストなどで使う
 */
export interface IDataBase {
	insertBookmark(data: IData.Bookmark): Promise<void>
	deleteBookmark(id: number): Promise<void>
	insertTag(tag:string):Promise<void>

	isExistsTag(tag:string): Promise<boolean>
	findBookmark(tags: string[]): Promise<IData.Bookmark>
	findTag(predicate: string): Promise<string[]>
}
