import { useCallback, useEffect, useRef, useState } from "react";
import type {
    FindTagMethod,
    SuggestionWindowProps,
} from "../components/SuggestionWindow";
import { useConfig } from "../providers/configProvider";

export function useSuggestionWindow(
    findTagMethod: FindTagMethod,
    onClickItem: (index: number) => void,
    getInputedTags: () => string[],
) {
    const { colorTheme } = useConfig();

    const [items, setItems] = useState<[string, boolean][][]>([]);
    const [predicate, setPredicate] = useState("");
    const [focusIndex, setFocusIndex] = useState(0);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getFocusedItem = useCallback(() => {
        let focusedItem = "";
        items.at(focusIndex)?.forEach((block) => (focusedItem += block[0]));
        return focusedItem;
    }, [items, focusIndex]);

    const close = useCallback(() => {
        setItems([]);
        setPredicate("");
        setFocusIndex(0);
    }, []);

    const onChangePredicateInputBox = async (targetVal: string) => {
        const suggestionItems = await findTagMethod(
            targetVal,
            getInputedTags(),
        );
        setItems(suggestionItems);
        setPredicate(targetVal);
        setFocusIndex(0);
    };

    useEffect(() => {
        const focusedItem = itemRefs.current.at(focusIndex);
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

    const props: SuggestionWindowProps = {
        items,
        onClickItem,
        focusIndex,
        itemRefs,
        colorTheme,
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
