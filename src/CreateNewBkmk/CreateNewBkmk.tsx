
export function useCreateNewBkmk() {
    
}

export const CreateNewBkmk = () => {
    return (
        <div className="create-new-bkmk-outer">
            <div className="create-new-bkmk-inner">
                <form action="">
                    <input type="text" name="url" />
                    <input type="text" name="tags" />
                    <button>キャンセル</button>
                    <button type="submit">作成</button>
                </form>
            </div>
        </div>
    )
}