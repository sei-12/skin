import { useCallback, useEffect, useRef, useState } from "react";
import type { BookmarkListProps } from "../components/BookmarkList";
import { useConfig } from "../providers/configProvider";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

export function useBookmarkList(
    onClickRemove: (key: number) => void,
    onClickEdit: (key: number) => void,
) {
    const [items, setItems] = useState<Bookmark[]>([]);
    const [focusIndex, setFocusIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToFocusItem = (focusIndex: number) => {
        // フォーカスが変更されたときにスクロールする
        const focusedItem = itemRefs.current.at(focusIndex);
        if (focusedItem !== undefined && focusedItem !== null) {
            focusedItem.scrollIntoView({ block: "nearest" });
        }
    };

    // fix: 一度閉じてから開いた時に、フォーカスしているアイテムが見えない
    useEffect(() => {
        scrollToFocusItem(focusIndex);
    }, [itemRefs, focusIndex]);

    const focusUp = useCallback(() => {
        setFocusIndex((cur) => {
            let newIndex = cur - 1;
            if (newIndex < 0) {
                newIndex = items.length - 1;
            }
            return newIndex;
        });
    }, [items]);

    const focusDown = useCallback(() => {
        setFocusIndex((cur) => {
            let newIndex = cur + 1;
            if (newIndex >= items.length) {
                newIndex = 0;
            }
            return newIndex;
        });
    }, [items]);

    const resetFocusIndex = useCallback(() => {
        setFocusIndex(0);
    }, []);

    const getFocusedItem = useCallback(() => {
        return items.at(focusIndex);
    }, [focusIndex, items]);

    const { colorTheme } = useConfig();

    const props: BookmarkListProps = {
        onClickEdit,
        onClickRemove,
        itemRefs,
        focusIndex,
        items,
        colorTheme,
    };

    return {
        items,
        setItems,
        // focusIndex,
        resetFocusIndex,
        getFocusedItem,
        focusDown,
        focusUp,
        props,
    };
}
