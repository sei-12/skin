import { useRef, useState } from "react";
import { InputTags, InputTagsProps, useInputTags } from "./InputTags"
import { ParsedHTML } from "../ts/html";
import { ResponseType, fetch } from "@tauri-apps/api/http";
import { DbAPI } from "../ts/db";


async function checkBkmkDatas(
    url: string,
    title: string,
    _desc: string,
    tags: string[]
): Promise<{
    isErr: boolean
    errs: string[]
}>{
    let errs: string[] = []
    let isErr = false

    if ( url === "" ){
        isErr = true     
        errs.push("URLが入力されていません。")
    }
    
    if ( title === "" ){
        isErr = true
        errs.push("タイトルが入力されていません")
    }
    
    if ( await DbAPI.existsBkmkWhereURL(url) ){
        isErr = true
        errs.push("すでに存在するURLです")
    }

    if ( tags.length === 0 ){
        isErr = true
        errs.push("タグが入力されていません")
    }
    return {
        isErr,
        errs
    }
}

async function parsedHTMLFromURL(url: string): Promise<ParsedHTML | null> {
    let responce = await fetch<string>(url,{
        method: "GET",
        responseType: ResponseType.Text
    })
    .catch( _ => {
        return null
    })

    if ( responce === null || !responce.ok ) {
        return null
    }

    let parsed = new ParsedHTML(responce.data)
    return parsed
}

export function useCreateNewBkmk() {
    const [windowHidden, setwindowHidden] = useState(true);
    const inputTagsHook = useInputTags()
    
    const urlBox   = useRef<HTMLInputElement>(null)
    const titleBox = useRef<HTMLInputElement>(null)
    const descBox  = useRef<HTMLTextAreaElement>(null)

    const open = () => setwindowHidden(false)

    const clearInput = () => {
        inputTagsHook.clearInput()
        if ( urlBox.current === null || titleBox.current === null || descBox.current === null ){
            return
        }
        urlBox.current.value = ""
        titleBox.current.value = ""
        descBox.current.value = ""
    }

    const onClickCancel = () => {
        setwindowHidden(true)
        clearInput()
    }
    
    const onChangeURL = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if ( urlBox.current === null || titleBox.current === null || descBox.current === null ){
            return
        }

        const parsed = await parsedHTMLFromURL(e.target.value)
        
        if ( parsed !== null && titleBox.current.value === "" ){
            titleBox.current.value = parsed.getTitle()
        }

        if ( parsed !== null && descBox.current.value === "" ){
            titleBox.current.value = parsed.getDesc()
        }
    }
    

    const onClickDone = async () => {
        if ( urlBox.current === null || titleBox.current === null || descBox.current === null ){
            return
        }
        

        let tags = inputTagsHook.getInputedTags()
        
        let checkResult = await checkBkmkDatas(
            urlBox.current.value,
            titleBox.current.value,
            descBox.current.value,
            tags
        )
        
        if ( checkResult.isErr ){
            console.log(checkResult.errs)
            return
        }

        await DbAPI.createNewBkmk(
            titleBox.current.value,
            urlBox.current.value,
            descBox.current.value,
            tags
        )

        setwindowHidden(true)
        clearInput()
    }
    
    const props: CreateNewBkmkProps = {
        hidden: windowHidden,
        inputTagsProps: inputTagsHook.props,
        onClickCancel,
        onChangeURL ,
        urlBox,
        titleBox,
        descBox,
        onClickDone
    }

    return {
        open,
        props
    }
}

type CreateNewBkmkProps = {
    inputTagsProps: InputTagsProps
    urlBox: React.RefObject<HTMLInputElement>
    titleBox: React.RefObject<HTMLInputElement>
    descBox: React.RefObject<HTMLTextAreaElement>
    hidden: boolean
    onClickCancel: () => void
    onChangeURL: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClickDone: () => void
}

export const CreateNewBkmk = (p: CreateNewBkmkProps) => {
    return (
        <div className="create-new-bkmk-outer" hidden={p.hidden}>
            <div className="create-new-bkmk-inner">

                <input ref={p.urlBox} type="text" placeholder="url" onChange={p.onChangeURL} />
                <input ref={p.titleBox} type="text" placeholder="title" />
                <textarea ref={p.descBox} placeholder="description"></textarea>

                <InputTags {...p.inputTagsProps}></InputTags>
                
                <button>URLからタイトルを取得</button>
                <button>URLから説明を取得</button>
                <button onClick={p.onClickCancel}>キャンセル</button>
                <button type="submit" onClick={p.onClickDone}>作成</button>
            </div>
        </div>
    )
}