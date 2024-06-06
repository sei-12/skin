import { TagSuggestion, useTagSuggesion } from "../TagSuggestion/TagSuggestion"
import { CreateNewTag, useCreateNewTag } from "./CreateNewTag"

export const HomeScreen = () => {
    const createNewTag = useCreateNewTag()
    const tagSuggestionHook = useTagSuggesion(
        (tag) => console.log(tag)
    )

    return (
        <div>
            Home
            <button onClick={createNewTag.open}>
                新規タグ作成
            </button>
            <input type="text" onChange={(e) => {
                tagSuggestionHook.open()
                tagSuggestionHook.setinput(e.target.value)
            }} />
            <TagSuggestion {...tagSuggestionHook.props}></TagSuggestion>
            <CreateNewTag {...createNewTag.props}></CreateNewTag>
        </div>
    )
}