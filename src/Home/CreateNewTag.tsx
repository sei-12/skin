import { useEffect, useRef, useState } from "react";
import "./CreateNewTag.css"
import { DbAPI } from "../ts/db";
import { checkNewTag } from "./checkNewTag";

type CreateNewTagProps = {
    hidden: boolean,
    onClickOuter: () => void,
    inputBox: React.RefObject<HTMLInputElement>
    canCreate: boolean
    onClickDone: () => void,
    onClickCancel: () => void,
    onChangeInputBox:(e: React.ChangeEvent<HTMLInputElement>) => void,
    errmsg: string
}

export const useCreateNewTag = () => {
    const [hidden, sethidden] = useState(true);
    const [canCreate, setcanCreate] = useState(false);
    const [errmsg, seterrmsg] = useState("");
    
    const inputBox = useRef<HTMLInputElement>(null)

    const open = () => {
        sethidden(false)
    }
    
    const close = () => {
        if ( inputBox.current !== null ){
            inputBox.current.value = ""
        }
        sethidden(true)
    }

    const onClickOuter = () => close()
    const onClickCancel = () => close()
    
    const onClickDone = async () => {
        if ( inputBox.current === null ){ return }
        await DbAPI.insertNewTag(inputBox.current.value).catch( err => console.error(err) )
        close()
    }

    useEffect(() => {
        if ( inputBox.current === null ){
            setcanCreate(false)
            seterrmsg("")
            return
        }
        
        updateCanCreate(inputBox.current.value)
    });
    
    const updateCanCreate = async (tag: string) => {
        let result = await checkNewTag(tag)

        if ( result.isErr === false ){
            setcanCreate(true)
            seterrmsg("")
            return
        }
        
        setcanCreate(false)

        if (result.errMessages.length === 1 && result.errMessages[0] === "空文字です" ){
            return
        }
        
        seterrmsg(result.errMessages.join("\n"))
    }

    const onChangeInputBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCanCreate(e.target.value)
    }

    const props: CreateNewTagProps = {
        canCreate,
        hidden,
        onClickOuter,
        inputBox,
        onClickCancel,
        onClickDone,
        onChangeInputBox,
        errmsg
    }

    return {
        props,
        open
    }
}

export const CreateNewTag = (p:CreateNewTagProps) => {
    return (
        <div onClick={p.onClickOuter} hidden={p.hidden} className="create-new-tag-outer">
            <div className="create-new-tag-inner" onClick={e => e.stopPropagation()}>
                <div>新規タグ作成</div>
                <input ref={p.inputBox} type="text" className="create-new-tag-input-box" onChange={p.onChangeInputBox}/>
                <button onClick={p.onClickCancel}>キャンセル</button>
                <DoneButton onClick={p.onClickDone} canCreate={p.canCreate} ></DoneButton>
                <div>{p.errmsg}</div>
            </div>
        </div>
    )
}

const DoneButton = (p: {
    canCreate: boolean,
    onClick: () => void
}) => {

    if ( p.canCreate ){
        return (
            <button onClick={p.onClick}>
                作成
            </button>
        )
    }else{
        return (
            <button>作成不可</button>
        )
    }
}