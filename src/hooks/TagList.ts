import { useEffect, useState } from "react";
import type { TagListProps } from "../components/TagList";
import type { TagRecord } from "../../src-tauri/bindings/export/DbModels";
import { DB } from "../services/database";
import { useNotice } from "../providers/NoticeProvider";
import { useConfig } from "../providers/configProvider";
import { useNavigate } from "react-router-dom";

export function useTagListPage(): TagListProps {
    const [tags, setTags] = useState<TagRecord[]>([]);
    const { addNotice } = useNotice();

    const load = async () => {
        const result = await DB.fetchTags().catch(() => {
            addNotice({
                message: "ERROR! タグの読み込みに失敗しました",
                serverity: "error",
            });
            return [];
        });

        setTags(result);
    };

    useEffect(() => {
        load();
    }, []);

    const onClickEdit = (id: number, newName: string) => {
        DB.editTag(id, newName)
            .then(() => {
                addNotice({
                    message: "SUCCESS!",
                    serverity: "success",
                });
                load();
            })
            .catch(() => {
                addNotice({
                    message: "ERROR! タグの更新に失敗しました",
                    serverity: "error",
                });
            });
    };

    const navigate = useNavigate();
    const onClickGoRoot = () => {
        navigate("/");
    };

    const { colorTheme } = useConfig();

    return {
        colorTheme,
        onClickEdit,
        onClickGoRoot,
        tags,
    };
}
