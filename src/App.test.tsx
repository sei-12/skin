import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import App from "./App";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import userEvent from "@testing-library/user-event";


describe("App",() => {
    test("hotkey",async () => {
        const {asFragment} = render(
            <HotkeysProvider initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}>
                <App></App>
            </HotkeysProvider>
        )
        
        await act(async () => {
            fireEvent.keyUp(document, { key: '/' });
        })
        
        let inputPredicateBox = screen.getByPlaceholderText("/")
        expect(inputPredicateBox).toHaveFocus()
        
        
        
        // MEMO: このテストは動かなくなる予定。（タグ検索のロジックがでこいだから）
        await act(async () => {
            userEvent.type(inputPredicateBox,"a")
        })
        
        expect(asFragment()).toMatchSnapshot()
        
    })
})