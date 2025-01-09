/* eslint-disable react-refresh/only-export-components */

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useState } from "react";
import type { Config } from "../../src-tauri/bindings/export/Config";

export function useConfig() {
    const c = useContext(ConfigContext);
    return c;
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

    useEffect(() => {
        invoke<Config>("get_config").then((con) => {
            setConfig(con);
        });

        listen("change-config-file", () => {
            invoke<Config>("get_config").then((con) => {
                setConfig(con);
            });
        });
    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}

// テストで使うためにexport
export const DEFAULT_CONFIG: Config = {
    colorTheme: {
        bg: "#000001",
        bookmarkItem: {
            bg: "#000002",
            desc: "#000003",
            title: "#000004",
            focusBg: "#000005",
            tag: "#000006",
        },
        suggestionWindow: {
            bg: "#000007",
            borderColor: "#000008",
            focusBg: "#000009",
            match: "#000010",
            unmatch: "#000011",
        },
        predicateInputBox: {
            bg: "#000012",
            caretColor: "#000013",
            textColor: "#000014",
            placeholder: "#000015",
        },
        tagItem: {
            bg: "#000013",
            borderColor: "#000014",
            exists: "#000015",
            notExists: "#000016",
        },
        createNewBookmark: {
            caretColor: "white",
            placeholder: "#000015",
            textColor: "white",
        }
    },
    keybinds: {
        focusDownBookmarkList: ["ctrl+n", "ArrowDown"],
        focusUpBookmarkList: ["ctrl+p", "ArrowUp"],
        closeWindow: "Escape",
        focusDownSuggestionWindow: ["ctrl+n", "ArrowDown"],
        focusUpSuggestionWindow: ["ctrl+p", "ArrowUp"],
        addFocusedSuggestionItem: "Enter",
        popInputedTag: "Backspace",
        closeSuggestionWindow: "Escape",
        navigateCreateNewBookmark: "ctrl+a",
        openUrl: "Enter",
        cancelCreateNewBookmark: "Escape",
        doneCreateNewBookmark: "ctrl+Enter",
        takeInputTag: "Space",
    },
};

const ConfigContext = createContext<Config>(DEFAULT_CONFIG);
