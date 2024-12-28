import type { ChangeEvent} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FindTagMethod, SuggestionWindowProps } from "../components/SuggestionWindow";

export function useSuggestionWindow(
    findTagMethod: FindTagMethod,
    getInputedTags: () => string[]
) {
    const [items, setItems] = useState<string[]>([]);
    const [predicate, setPredicate] = useState("");
    const [focusIndex, setFocusIndex] = useState(0);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getFocusedItem = useCallback(() => {
        return items.at(focusIndex);
    },[items,focusIndex])

    const close = useCallback(() => {
        setItems([]);
        setPredicate("");
        setFocusIndex(0);
    },[])

    const onChangePredicateInputBox = async (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const suggestionItems = await findTagMethod(
            e.target.value,
            getInputedTags()
        );
        setItems(suggestionItems);
        setPredicate(e.target.value);
        setFocusIndex(0);
    };

    useEffect(() => {
        // フォーカスが変更されたときにスクロールする
        const focusedItem = itemRefs.current.at( focusIndex );
        if (focusedItem !== null && focusedItem !== undefined) {
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

    const props: SuggestionWindowProps = {
        items,
        predicate,
        focusIndex,
        itemRefs,
    };

    return {
        props,
        onChangePredicateInputBox,
        close,
        getFocusedItem,
        focusDown,
        focusUp,
        

        items,
        setItems,
        predicate,
        setPredicate,
    };
}