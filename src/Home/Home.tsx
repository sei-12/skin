import { useRef } from "react"
import { TagSuggestion, useTagSuggesion } from "../TagSuggestion/TagSuggestion"
import { CreateNewTag, useCreateNewTag } from "./CreateNewTag"

export const HomeScreen = () => {
    const createNewTag = useCreateNewTag()
    const tagSuggestionHook = useTagSuggesion(
        (tag) => console.log(tag)
    )
    const inputElm = useRef<HTMLInputElement>(null)

    return (
        <div>
            Home
            <button onClick={createNewTag.open}>
                新規タグ作成
            </button>
            <input ref={inputElm} type="text" onChange={(e) => {
                tagSuggestionHook.open()
                tagSuggestionHook.rePosition({
                    top: e.target.offsetTop + e.target.offsetHeight + "px",
                    left: e.target.offsetLeft + "px"
                })
                tagSuggestionHook.setinput(e.target.value)
            }} />
            <TagSuggestion {...tagSuggestionHook.props}></TagSuggestion>
            <CreateNewTag {...createNewTag.props}></CreateNewTag>
        </div>
    )
}