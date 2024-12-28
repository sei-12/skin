import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FindTagMethod, SuggestionWindowProps } from "../components/SuggestionWindow";

export function useSuggestionWindow(
    findTagMethod: FindTagMethod,
    getInputedTags: () => string[]
) {
    const [items, setItems] = useState<string[]>([]);
    const [predicate, setPredicate] = useState("");
    const [focusIndex, setFocusIndex] = useState(0);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getFocusedItem = () => {
        return items.at(focusIndex);
    };
    const close = () => {
        setItems([]);
        setPredicate("");
        setFocusIndex(0);
    };

    const onChangePredicateInputBox = async (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        let suggestionItems = await findTagMethod(
            e.target.value,
            getInputedTags()
        );
        setItems(suggestionItems);
        setPredicate(e.target.value);
        setFocusIndex(0);
    };

    useEffect(() => {
        // フォーカスが変更されたときにスクロールする
        const focusedItem = itemRefs.current[focusIndex];
        if (focusedItem) {
            focusedItem.scrollIntoView({ block: "nearest" });
        }
    }, [focusIndex]);

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
        items,
        setItems,
        predicate,
        setPredicate,
        focusIndex,
        setFocusIndex,
    };
}