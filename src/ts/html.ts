
// async function getRequest(url: string): Promise<{
//     isErr: boolean,
//     responce: string
// }>{

//     return {
//         isErr: false,
//         responce: `
//         `
//     }
// }


/**
 * HTMLの解析が失敗したとしてもエラーは出ない！
 * 要素を取得しようとした時にNULLがかえるだけ
 * 現時点ではその方法でも特に問題がないと思うからそうする
 */
export class ParsedHTML {
    private doc: Document
    
    constructor(html: string){
        let parser = new DOMParser()
        let doc = parser.parseFromString(html,"text/html")
        this.doc = doc
    }

    /**
     * nullの場合は　”” （空文字）を返す
     */
    getTitle(): string{
        let titleElement = this.doc.querySelector("title")
        if ( titleElement === null ){
            return ""
        }else{
            return titleElement.innerHTML
        }

    }
    
    /**
     * nullの場合は　”” （空文字）を返す
     */
    getDesc():string{
        let descElement = this.doc.querySelector('meta[name="description"]');
        let desc = descElement?.getAttribute("content")
        return desc ? desc : ""
    }
}
