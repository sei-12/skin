import { Stack } from "@mui/material";
import { BookmarkItem } from "./BookmarkItem";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

export type BookmarkListProps = {
    onClickEdit: (key: number) => void;
    onClickRemove: (key: number) => void;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    focusIndex: number;
    items: Bookmark[];
    colorTheme: ColorTheme;
};

export function BookmarkList(p: BookmarkListProps) {
    return (
        <Stack
            spacing={1}
            sx={{
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                flexGrow: 1,
                padding: 0.5,
            }}
        >
            {p.items.map((item, i) => {
                return (
                    <BookmarkItem
                        ref={(el) => (p.itemRefs.current[i] = el)}
                        data={item}
                        focus={p.focusIndex === i}
                        key={item.id}
                        onClickEdit={p.onClickEdit}
                        onClickRemove={p.onClickRemove}
                        colorTheme={p.colorTheme}
                    ></BookmarkItem>
                );
            })}
        </Stack>
    );
}
