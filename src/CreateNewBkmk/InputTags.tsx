import { useRef, useState } from "react";
import { DbAPI } from "../ts/db"
import { TagSuggestion, TagSuggestionProps, useTagSuggesion } from "../TagSuggestion/TagSuggestion";
import { useHotkeys } from "react-hotkeys-hook";
import { checkNewTag } from "../ts/checkNewTag";

/**
 * 存在しないタグを存在しないものとして入力することが可能
 */
export const useInputTags = () => {
    
    const [tagItemProps, settagItemProps] = useState<TagItemProps[]>([]);
    const tagSuggestionHook = useTagSuggesion(tagSuggestionHandler)
    const inputElm = useRef<HTMLInputElement>(null)

    
    function tagSuggestionHandler(tag: DbAPI.TagsRecord){
        settagItemProps(
            [...tagItemProps,{exists: true, value: tag.value}]
        )
        
        if ( inputElm.current === null ){
            console.error("想定してない")
            return
        }
        
        inputElm.current.value = ""
    }

    function handleBackspace(){
        if ( inputElm.current === null ){
            return
        }
        let newItemProps = [...tagItemProps]
        newItemProps.pop()
        settagItemProps(newItemProps)
    }

    async function handleSpace(){
        if ( inputElm.current === null ){
            return
        }
        if ( inputElm.current.value === "" ){
            return
        }

        let inputedTag = inputElm.current.value
        inputElm.current.value = ""
        let exists = await DbAPI.existsTag(inputedTag)

        if ( exists ){
            settagItemProps(
                [...tagItemProps,{exists: true, value: inputedTag }]
            )
            return
        }

        let checkResult = await checkNewTag(inputedTag)
        if ( checkResult.isErr ){
            return
        }
        
        settagItemProps(
            [...tagItemProps,{exists: false, value: inputedTag }]
        )
    }
    
    /**
     * DBに存在するタグ、存在しないタグの両方が含まれている.
     * 入力中にDBが更新される可能性があるため、存在するしないの情報を保持するのは難しいと判断した.
     * この関数の戻り値を元にDBの更新を行う際は、その都度必要に応じて整合性の確認をすること.
     */
    const getInputedTags = ():string[] => {
        return tagItemProps.map( p => p.value )
    }
    
    const onChangeInputBox = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let checkResult = await checkNewTag(e.target.value)
        if ( checkResult.isErr ){

        }

        tagSuggestionHook.open()
        tagSuggestionHook.rePosition({
            top: e.target.offsetTop + e.target.offsetHeight + "px",
            left: e.target.offsetLeft + "px"
        })
        tagSuggestionHook.setinput(e.target.value)
    }
    

    const hotkeyEnabled = (): boolean => {
        if ( inputElm.current === null ){
            return false
        }
        if ( inputElm.current !== document.activeElement ){
            return false
        }

        return true
    }

    useHotkeys(
        "ctrl+Backspace",
        handleBackspace,
        {
            enableOnFormTags:["INPUT"],
            enabled:hotkeyEnabled
        },
        [inputElm,tagItemProps]
    )
    useHotkeys(
        "ctrl+Space",
        handleSpace,
        {
            enableOnFormTags:["INPUT"],
            enabled:hotkeyEnabled
        },
        [inputElm,tagItemProps]
    )
    
    const clearInput = () => {
        settagItemProps([])
        tagSuggestionHook.setinput("")
        if ( inputElm.current === null )return;
        inputElm.current.value = ""
    }

    const props: InputTagsProps = {
        tagItemProps,
        tagSuggestionProps: tagSuggestionHook.props,
        inputElm,
        onChangeInputBox
    }

    return {
        props,
        getInputedTags,
        clearInput
    }
}


export type InputTagsProps = {
    tagItemProps: TagItemProps[]
    tagSuggestionProps: TagSuggestionProps
    inputElm: React.RefObject<HTMLInputElement>
    onChangeInputBox: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputTags = (p: InputTagsProps) => {
    return (
        <div>
            {
                p.tagItemProps.map( (val,index) => {
                    return (
                        <TagItem
                            key={index}
                            {...val}
                        ></TagItem>
                    )
                })                
            }
            
            <input ref={p.inputElm} type="text" onChange={p.onChangeInputBox} />
            <TagSuggestion {...p.tagSuggestionProps}></TagSuggestion>
        </div>
    )
}


type TagItemProps = {
    exists: boolean
    value: string    
}

function tagItemClassName(exists: boolean):string{
    let className = "input-tag-tag-item-base"
    
    if ( exists ){
        className += " input-tag-tag-item-exists"
    }else{
        className += " input-tag-tag-item-not-exists"
    }
    
    return className
}

const TagItem = (p: TagItemProps) => {
    return (
        <div className={tagItemClassName(p.exists)} >
            {p.value}
        </div>
    )
}