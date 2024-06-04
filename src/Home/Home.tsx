import { CreateNewTag, useCreateNewTag } from "./CreateNewTag"

export const HomeScreen = () => {
    const createNewTag = useCreateNewTag()

    return (
        <div>
            Home
            <button onClick={createNewTag.open}>
                新規タグ作成
            </button>
            <CreateNewTag {...createNewTag.props}></CreateNewTag>
        </div>
    )
}