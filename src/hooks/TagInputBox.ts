import type { FindTagMethod } from "../components/SuggestionWindow";
import type { TagInputBoxProps } from "../components/TagInputBox";
import { useSuggestionWindow } from "../hooks/SuggestionWindow";

import { useCallback, useRef, useState } from "react";
import { DB } from "../services/database";
import { useConfig } from "../providers/configProvider";
import { useNotice } from "../providers/NoticeProvider";

export function useTagInputBox(findTagMethod: FindTagMethod) {
    const inputBoxRef = useRef<HTMLInputElement>(null);
    const [inputedTags, setInputedTags] = useState<
        { text: string; exists: boolean }[]
    >([]);

    const { addNotice } = useNotice();

    const onClickItem = (index: number) => {
        let item = "";
        suggestionWindowHook.items[index].forEach((t) => {
            item += t[0];
        });
        addItem(item);
    };

    const suggestionWindowHook = useSuggestionWindow(
        findTagMethod,
        onClickItem,
        () => {
            return inputedTags.map((t) => t.text);
        },
    );

    const { colorTheme } = useConfig();

    const props: TagInputBoxProps = {
        swProps: suggestionWindowHook.props,
        inputBoxRef,
        inputedTags,
        onChangePredicateInputBox:
            suggestionWindowHook.onChangePredicateInputBox,
        colorTheme,
    };

    // TODO: rename
    const popInputedTag = useCallback(() => {
        const inputBox = inputBoxRef.current;

        if (inputBox === null) {
            return;
        }
        if (inputBox.value !== "") {
            return;
        }

        inputBox.value = "";
        const newInputedTags = [...inputedTags];
        newInputedTags.pop();
        setInputedTags(newInputedTags);

        // 動作しない！！！
        // 理由はわからない
        // テストは通るけど実際に動かすとコールバック関数が２度呼ばれて１度
        // バックスペースを押しただけで２個削除される.
        // popInputedTag自体は1度しか呼ばれないので、依存関係にInputtedTag
        // を追加して上記のような実装にした
        //
        // 不具合を起こすコード
        // setInputedTags((ary) => {
        //     console.log("hello") // 2回呼ばれる
        //     ary.pop();
        //     return [...ary];
        // });
        //
    }, [inputedTags]);

    const addItem = async (item: string) => {
        const inputBox = inputBoxRef.current;

        if (inputBox === null) {
            return;
        }
        if (item === undefined) {
            return;
        }

        inputBox.value = "";

        const exists = await DB.isExistsTag(item).catch(() => {
            addNotice({
                message: "ERROR!",
                serverity: "error",
            });

            return false;
        });
        setInputedTags((ary) => {
            return [...ary, { text: item, exists }];
        });

        suggestionWindowHook.close();
    };

    const addFocusedSuggestionItem = useCallback(async () => {
        const item = suggestionWindowHook.getFocusedItem();
        addItem(item);
    }, [suggestionWindowHook.getFocusedItem]);

    const focusPredicateInputBox = useCallback(() => {
        inputBoxRef.current?.focus();
    }, []);

    return {
        inputBoxRef,
        popInputedTag,
        focusPredicateInputBox,
        addFocusedSuggestionItem,

        inputedTags,
        setInputedTags,
        suggestionWindowHook,
        props,
    };
}
