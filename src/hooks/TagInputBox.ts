import type { FindTagMethod } from "../components/SuggestionWindow";
import type { TagInputBoxProps } from "../components/TagInputBox";
import { useSuggestionWindow } from "../hooks/SuggestionWindow";

import { useCallback, useRef, useState } from "react";
export function useTagInputBox(findTagMethod: FindTagMethod) {
    const inputBoxRef = useRef<HTMLInputElement>(null);
    const [inputedTags, setInputedTags] = useState<
        { text: string; exists: boolean }[]
    >([]);

    const suggestionWindowHook = useSuggestionWindow(findTagMethod, () => {
        return inputedTags.map((t) => t.text);
    });

    const props: TagInputBoxProps = {
        swProps: suggestionWindowHook.props,
        inputBoxRef,
        inputedTags,
        onChangePredicateInputBox:
            suggestionWindowHook.onChangePredicateInputBox,
    };

    // 名前が相応しくない
    // inputBoxの状態によって挙動が変わるのが良くない
    const popInputedTag = useCallback(
        () => {
            const inputBox = inputBoxRef.current;

            if (inputBox === null) {
                return;
            }
            if (inputBox.value !== "") {
                return;
            }

            inputBox.value = "";
            setInputedTags((ary) => {
                ary.pop();
                return [...ary];
            });
        }, []
    )

    // 名前が相応しくない
    // inputBoxの状態によって挙動が変わるのが良くない
    const addFocusedSuggestionItem = useCallback(() => {
        const item = suggestionWindowHook.getFocusedItem();
        const inputBox = inputBoxRef.current;

        if (inputBox === null) {
            return;
        }
        if (item === undefined) {
            return;
        }

        inputBox.value = "";

        setInputedTags((ary) => {
            return [...ary, { text: item, exists: true }];
        });

        suggestionWindowHook.close();
    }, [suggestionWindowHook.getFocusedItem])
    

    const focusPredicateInputBox = useCallback(() => {
        inputBoxRef.current?.focus();
    },[])

    return {
        inputBoxRef,
        popInputedTag,
        focusPredicateInputBox,
        addFocusedSuggestionItem,

        inputedTags,
        setInputedTags,
        suggestionWindowHook,
        props
    };
}