import { Button, TextField } from "@mui/material";
import { useRef } from "react";
import { TagInputBox, useTagInputBox } from "../components/TagInputBox";


export function useCreateNewBookmark(
    onClickDone: () => void,
    onClickCancel: () => void,
    onChangeInputBox: () => void,
    onChangeUrl: (url: string) => void,
) {
    
    const titleRef = useRef<HTMLInputElement>(null)
    const urlRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLInputElement>(null)

	const tagInputBoxHook = useTagInputBox(onChangeInputBox)

    const setContent = (title: string, desc: string) => {
        if ( titleRef.current === null ){
            return
        }
        if ( descRef.current === null ){
            return
        }
        titleRef.current.value = title
        descRef .current.value = desc
    };
    
    const setUrl = (url: string) => {
        if ( urlRef.current === null ){
            return
        }
        urlRef.current.value = url
        // イベントを発生させたかったけど、少し難しかった。
        onChangeUrl(url)
    }

    const getInputData = () => {
        if ( titleRef.current === null ){
            return
        }
        if ( urlRef.current === null ){
            return
        }
        if ( descRef.current === null ){
            return
        }
        
        return {
            title: titleRef.current.value,
            desc:  descRef .current.value,
            url:   urlRef  .current.value,
            tags: tagInputBoxHook.inputedTags.map( e => e.text )
        }
    };

    const clearData = () => {
        if ( titleRef.current === null ){
            return
        }
        if ( urlRef.current === null ){
            return
        }
        if ( descRef.current === null ){
            return
        }

        titleRef.current.value = ""
        descRef .current.value = ""
        urlRef  .current.value = ""
        
        tagInputBoxHook.setInputedTags([])
    };

    return {
        props: {
            titleRef,
            descRef,
            urlRef,
			tagInputBox: tagInputBoxHook.props,
            onClickCancel,
            onClickDone,
            onChangeUrl,
        },
		tagInputBoxHook,
        setContent,
        getInputData,
        clearData,
        setUrl,
    };
}

export function CreateNewBookmark(p: ReturnType<typeof useCreateNewBookmark>["props"]){
    return (
        <div>
			<TextField inputRef={p.urlRef} sx={{ width: 0.8 }} placeholder={"url"} onChange={(e) => {p.onChangeUrl(e.target.value)}} />
			<TextField inputRef={p.titleRef} sx={{
				width: 0.8
			}}placeholder={"title"} />
			<TagInputBox {...p.tagInputBox}/>
			<TextField inputRef={p.descRef} sx={{
				width: 1
			}}placeholder={"desc"} />
			<Button onClick={p.onClickCancel}>Cancel</Button>
			<Button onClick={p.onClickDone}>Done</Button>
		</div>
    )    
}

