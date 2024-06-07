import { CreateNewTag, useCreateNewTag } from "./CreateNewTag"
import { InputTags, useInputTags } from "../CreateNewBkmk/InputTags"

export const HomeScreen = () => {
    const createNewTag = useCreateNewTag()
    
    const inputTagsHook = useInputTags()

    return (
        <div>
            Home
            <button onClick={createNewTag.open}>
                新規タグ作成
            </button>
            <InputTags {...inputTagsHook.props}></InputTags>
            <CreateNewTag {...createNewTag.props}></CreateNewTag>
        </div>
    )
}