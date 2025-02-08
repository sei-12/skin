import { useHotkeysContext } from "react-hotkeys-hook";

//
// TODO
// ページを分けたから必要ない
// default,suggestion_windowの二つでいいと思う
//
export const HOTKEY_SCOPES = {
    SEARCH_BOOKMARK: "search_bookmark",
    SEARCH_BOOKMARK_SUGGESTION_WINDOW: "SEARCH_BOOKMARK_SUGGESTION_WINDOW",

    CREATE_NEW_BOOKMARK: "CREATE_NEW_BOOKMARK",
    CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW: "CREATE_NEW_BOOKMARK_SUGGESTION_WINDOW",

    EDIT_BOOKMARK: "EDIT_BOOKMARK",
} as const;

type HOTKEY_SCOPES = (typeof HOTKEY_SCOPES)[keyof typeof HOTKEY_SCOPES]


export function useAppHotkey() {
    const hotkeysContext = useHotkeysContext()

    const switchScope = (to: HOTKEY_SCOPES) => {
        hotkeysContext.enabledScopes.forEach(scope => {
            hotkeysContext.disableScope(scope)
        })
        hotkeysContext.enableScope(to)
    }

    return {
        switchScope
    }
}