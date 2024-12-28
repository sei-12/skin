import { Stack } from "@mui/material";
import { IData } from "../dts/data";
import { BookmarkItem } from "./BookmarkItem";

export type BookmarkListProps = {
    onClickEdit: (key: number) => void;
    onClickRemove: (key: number) => void;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    focusIndex: number;
    items: IData.Bookmark[];
};

export function BookmarkList(props: BookmarkListProps) {
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
            {props.items.map((item, i) => {
                return (
                    <BookmarkItem
                        ref={(el) => (props.itemRefs.current[i] = el)}
                        data={item}
                        focus={props.focusIndex === i}
                        key={item.id}
                        onClickEdit={props.onClickEdit}
                        onClickRemove={props.onClickRemove}
                    ></BookmarkItem>
                );
            })}
        </Stack>
    );
}
