import { useEffect, useRef, useState } from "react";
import { IData } from "../dts/data";
import { BookmarkListProps } from "../components/BookmarkList";

export function useBookmarkList(
    onClickRemove: (key: number) => void,
    onClickEdit: (key: number) => void
) {
    const [items, setItems] = useState<IData.Bookmark[]>([]);
    const [focusIndex, setFocusIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // フォーカスが変更されたときにスクロールする
        const focusedItem = itemRefs.current[focusIndex];
        if (focusedItem) {
            focusedItem.scrollIntoView({ block: "nearest" });
        }
    }, [focusIndex]);

    const props: BookmarkListProps = {
        onClickEdit,
        onClickRemove,
        itemRefs,
        focusIndex,
        items,
    };

    return {
        items,
        setItems,
        focusIndex,
        setFocusIndex,
        props,
    };
}