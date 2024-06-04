import { DbAPI } from "../ts/db"
import { isHankaku } from "../ts/utils"

const MAX_TAG_CHARS = 32

export async function checkNewTag(tag: string){
    let isErr = false 
    let errMessages:string[] = []
    
    if ( tag === "" ){
        isErr = true
        errMessages.push("空文字です")
    }
    
    if ( tag.length > MAX_TAG_CHARS ) {
        isErr = true        
        errMessages.push(`タグは${MAX_TAG_CHARS}文字以下である必要があります`)
    }

    if ( tag !== "" && !isHankaku(tag) ) {
        isErr = true
        errMessages.push("半角文字のみが有効です")
    }

    // エラーの場合はexistsTagを実行しない
    if ( !isErr && await DbAPI.existsTag(tag) ) {
        isErr = true
        errMessages.push("すでに存在しているタグです")
    }

    return { isErr, errMessages }
}