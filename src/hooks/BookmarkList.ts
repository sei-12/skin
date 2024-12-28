import { useCallback, useEffect, useRef, useState } from "react";
import type { IData } from "../dts/data";
import type { BookmarkListProps } from "../components/BookmarkList";

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

    const focusUp = useCallback(() => {
        setFocusIndex((cur) => {
            let newIndex = cur - 1;
            if (newIndex < 0) {
                newIndex = items.length - 1;
            }
            return newIndex;
        })
    }, [items])

    const focusDown = useCallback(() => {
        setFocusIndex((cur) => {
            let newIndex = cur + 1;
            if (newIndex >= items.length) {
                newIndex = 0;
            }
            return newIndex;
        })
    }, [items])


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
        // focusIndex,
        setFocusIndex,
        
        focusDown,
        focusUp,
        props,
    };
}