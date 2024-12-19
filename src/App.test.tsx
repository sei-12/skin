import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test, vi } from "vitest";
import App from "./App";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import userEvent from "@testing-library/user-event";
import { IDataBase } from "./database";
import { IData } from "./data";

const dbConnection:IDataBase = vi.hoisted(() => ({
    async insertBookmark(_title: string, _url: string, _desc: string , _tags: string[]): Promise<void> { },
    async deleteBookmark(_id: number): Promise<void> { },
    async insertTag(_tag: string): Promise<void> { },
    async isExistsTag(_tag: string): Promise<boolean> {
        return true
    },
    async findBookmark(_tags: string[]): Promise<IData.Bookmark[]> {
        return []
    },
    async findTag(_predicate: string): Promise<string[]> {
        return [
            "a",
            "b",
            "c"
        ]
    }
}))

vi.mock("./database",() => ({
    dbConnection
}))

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