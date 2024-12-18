import { Button, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { TagInputBox, useTagInputBox } from "../components/TagInputBox";


export function useCreateNewBookmark() {
    
    const titleRef = useRef<HTMLInputElement>(null)
    const urlRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLInputElement>(null)

    const [validationError, setValidationError] = useState<string | null>(null);

	const tagInputBoxHook = useTagInputBox(() => {})

    const setInputData = (name: string, value: string) => {
        // setData((prev) => ({ ...prev, [name]: value }));
    };

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
        urlRef  .current.value = "    "
    };

    return {
        props: {
            titleRef,
            descRef,
            urlRef,
			tagInputBox: tagInputBoxHook.props
        },
		tagInputBoxHook,
        validationError,
        setInputData,
        getInputData,
        clearData,
    };
}

export function CreateNewBookmark(p: ReturnType<typeof useCreateNewBookmark>["props"]){
    return (
        <div>
			<TextField sx={{
				width: 0.8
			}}placeholder={"title"} />
			<TextField sx={{
				width: 0.8
			}}placeholder={"url"} />
			<TagInputBox {...p.tagInputBox}/>
			<TextField sx={{
				width: 1
			}}placeholder={"desc"} />
			<Button>Cancel</Button>
			<Button>Done</Button>
		</div>
    )    
}

