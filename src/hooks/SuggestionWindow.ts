import { useCallback, useEffect, useRef, useState } from "react";
import type { FindTagMethod, SuggestionWindowProps } from "../components/SuggestionWindow";
import { useConfig } from "../providers/configProvider";

export function useSuggestionWindow(
    findTagMethod: FindTagMethod,
    getInputedTags: () => string[]
) {
    const { colorTheme } = useConfig();

    const [items, setItems] = useState<string[]>([]);
    const [predicate, setPredicate] = useState("");
    const [focusIndex, setFocusIndex] = useState(0);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getFocusedItem = useCallback(() => {
        return items.at(focusIndex);
    }, [items, focusIndex])

    const close = useCallback(() => {
        setItems([]);
        setPredicate("");
        setFocusIndex(0);
    }, [])

    const onChangePredicateInputBox = async (
        targetVal: string
    ) => {
        const suggestionItems = await findTagMethod(
            targetVal,
            getInputedTags()
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

export function highlightMatchedBlocks(
    predicate: string,
    item: string
): { isMatch: boolean; text: string }[] {
    const blocks: ReturnType<typeof highlightMatchedBlocks> = [];

    const splitedPredicate = [...predicate];
    const splitedItem = [...item];

    while (splitedItem.length !== 0) {
        const p = splitedPredicate[0];

        if (p === undefined) {
            break; 
        }

        const i = splitedItem.shift()!;

        // 大文字小文字を区別しない
        const match = i.toLowerCase() === p.toLocaleLowerCase();

        if (match) {
            splitedPredicate.shift();
        }
        const lastBlock = blocks.at(-1);
        if (lastBlock === undefined) {
            blocks.push({ isMatch: match, text: i });
        } else {
            if (lastBlock.isMatch === match) {
                lastBlock.text += i;
            } else {
                blocks.push({ isMatch: match, text: i });
            }
        }
    }

    // flag1からここにくる可能性あり
    if (splitedItem.length !== 0) {
        blocks.push({ text: splitedItem.join(""), isMatch: false }
        )
    }


    return blocks;
}
