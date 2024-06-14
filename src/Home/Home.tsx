import { CreateNewTag, useCreateNewTag } from "./CreateNewTag"
import { CreateNewBkmk, useCreateNewBkmk } from "../CreateNewBkmk/CreateNewBkmk"

export const HomeScreen = () => {
    const createNewTag = useCreateNewTag()
    
    const createNewBkmkHook = useCreateNewBkmk()

    return (
        <div>
            <button onClick={createNewTag.open}>
                新規タグ作成
            </button>
            <button onClick={createNewBkmkHook.open}>新規ブックマーク作成</button>
            <CreateNewBkmk {...createNewBkmkHook.props}></CreateNewBkmk>
            <CreateNewTag {...createNewTag.props}></CreateNewTag>
        </div>
    )
}