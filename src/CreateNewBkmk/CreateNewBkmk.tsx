import { useRef, useState } from "react";
import { InputTags, InputTagsProps, useInputTags } from "./InputTags"
import { ParsedHTML } from "../ts/html";
import { ResponseType, fetch } from "@tauri-apps/api/http";



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
    const onClickCancel = () => {
        setwindowHidden(true)
    }
    
    const onChangeURL = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if ( urlBox.current === null || titleBox.current === null || descBox.current === null ){
            return
        }

        const parsed = await parsedHTMLFromURL(e.target.value)
        
        if ( parsed === null ){
            titleBox.current.value = ""
            descBox.current.value = ""
        }else{
            titleBox.current.value = parsed.getTitle()
            descBox.current.value = parsed.getDesc()
        }
    }
    
    const props: CreateNewBkmkProps = {
        hidden: windowHidden,
        inputTagsProps: inputTagsHook.props,
        onClickCancel,
        onChangeURL ,
        urlBox,
        titleBox,
        descBox
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
}

export const CreateNewBkmk = (p: CreateNewBkmkProps) => {
    return (
        <div className="create-new-bkmk-outer" hidden={p.hidden}>
            <div className="create-new-bkmk-inner">

                <input ref={p.urlBox} type="text" placeholder="url" onChange={p.onChangeURL} />
                <input ref={p.titleBox} type="text" placeholder="title" />
                <textarea ref={p.descBox} placeholder="description"></textarea>

                <InputTags {...p.inputTagsProps}></InputTags>
                <button onClick={p.onClickCancel}>キャンセル</button>
                <button type="submit">作成</button>
            </div>
        </div>
    )
}