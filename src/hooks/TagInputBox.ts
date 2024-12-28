import { FindTagMethod } from "../components/SuggestionWindow";
import { TagInputBoxProps } from "../components/TagInputBox";
import { useSuggestionWindow } from "../hooks/SuggestionWindow";

import { useRef, useState } from "react";
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
    return {
        inputBoxRef,

        inputedTags,
        setInputedTags,
        suggestionWindowHook,
        props
    };
}