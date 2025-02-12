import { useEffect, useState } from "react";
import type { TagListProps } from "../components/TagList";
import type { TagRecord } from "../../src-tauri/bindings/export/DbModels";
import { DB } from "../services/database";
import { useNotice } from "../providers/NoticeProvider";
import { useConfig } from "../providers/configProvider";

export function useTagListPage(): TagListProps {

    const [tags, setTags] = useState<TagRecord[]>([])
    const { addNotice } = useNotice()

    const load = async () => {
        const result = await DB.fetchTags().catch(() => {

            addNotice({
                message: "ERROR!",
                serverity: "error",
            })
            return []
        });



        setTags(result)
    }


    useEffect(() => {
        load()
    }, [])

    const onClickDelete = (id: number) => {
        console.log("delete tag ", id)
    }

    const onClickEdit = (id: number, newName: string) => {
        console.log("edit tag ", id, newName)
    }

    const onClickGoRoot = () => { }

    const { colorTheme } = useConfig()

    return {
        onClickDelete,
        colorTheme,
        onClickEdit,
        onClickGoRoot,
        tags,
    }
}