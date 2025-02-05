import { render, renderHook, screen } from "@testing-library/react";
import { test, describe, vi, expect, beforeEach } from "vitest";
import { useBookmarkForm } from "./BookmarkForm";
import type { FindTagMethod } from "../components/SuggestionWindow";
import { BookmarkForm } from "../components/BookmarkForm";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hotkey";
import { act } from "react";
import { startMockWindowVisibleController } from "../services/windowVisibleController.test";
import { startMockDB } from "../services/database.test";
import { findTagMethod } from "../services/findTagMethod";
import userEvent from "@testing-library/user-event";

describe("BookmarkForm", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        startMockWindowVisibleController();
        startMockDB();
    });

    test("test1", async () => {
        const user = userEvent.setup();
        const findTagMethod_ = vi.fn<FindTagMethod>(async (predicate,inputedTags) => {
            return findTagMethod(predicate,inputedTags)
        });

        const wrapper : React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <HotkeysProvider
                initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
            >
                {children}
            </HotkeysProvider>
        );
        const hook = renderHook(
            () => {
                return useBookmarkForm(
                    vi.fn(),
                    vi.fn(),
                    findTagMethod_,
                    vi.fn()
                );
            },
            { wrapper }
        );

        render(
            <HotkeysProvider
                initiallyActiveScopes={[HOTKEY_SCOPES.CREATE_NEW_BOOKMARK]}
            >
                <BookmarkForm {...hook.result.current.props}></BookmarkForm>
            </HotkeysProvider>
        );

        const titleInputBox: HTMLInputElement =
            screen.getByPlaceholderText("title");
        const urlInputBox: HTMLInputElement =
            screen.getByPlaceholderText("url");
        const descInputBox: HTMLInputElement =
            screen.getByPlaceholderText("desc");

        expect(titleInputBox.value).toBe("");
        expect(urlInputBox.value).toBe("");
        expect(descInputBox.value).toBe("");
        
        await act(async () => {
            hook.result.current.setContent("title-hello","desc-hello",["typescript"])
            hook.result.current.setUrl("url-hello")
        })
        
        expect(titleInputBox.value).toBe("title-hello");
        expect(urlInputBox.value).toBe("url-hello");
        expect(descInputBox.value).toBe("desc-hello");
        
        let inputedData = hook.result.current.getInputData()
        expect(inputedData.desc).toBe("desc-hello")
        expect(inputedData.title).toBe("title-hello")
        expect(inputedData.url).toBe("url-hello")
        expect(inputedData.tags).toEqual(["typescript"])

        await act(async () => {
            hook.result.current.clearData()
        })
        
        expect(titleInputBox.value).toBe("");
        expect(urlInputBox.value).toBe("");
        expect(descInputBox.value).toBe("");
        
        inputedData = hook.result.current.getInputData()
        expect(inputedData.desc).toBe("")
        expect(inputedData.title).toBe("")
        expect(inputedData.url).toBe("")
        expect(inputedData.tags).toEqual([])
        
        const inputTagBox: HTMLInputElement = screen.getByPlaceholderText("/")
        await user.type(inputTagBox,"helloworld")
        await act(async () => {
            await hook.result.current.takeInputTag()
        })
        inputedData = hook.result.current.getInputData()
        expect(inputTagBox.value).toBe("")
        expect(inputedData.tags).toEqual(["helloworld"])

        await act(async () => {
            hook.result.current.clearData()
        })

        await act(async () => {
            hook.result.current.setContent("title-hello","desc-hello",["typescript"])
            hook.result.current.setUrl("url-hello")
        })
        await user.type(inputTagBox,"helloworld")
        await act(async () => {
            await hook.result.current.takeInputTag()
        })
        inputedData = hook.result.current.getInputData()

        inputedData = hook.result.current.getInputData()
        expect(inputedData.desc).toBe("desc-hello")
        expect(inputedData.title).toBe("title-hello")
        expect(inputedData.url).toBe("url-hello")
        expect(inputedData.tags).toEqual(["typescript", "helloworld"])
        
        await user.type(titleInputBox,"-hello")
        await user.type(descInputBox,"-hello")
        await user.type(urlInputBox,"-hello")
        await user.type(inputTagBox,"123")

        inputedData = hook.result.current.getInputData()
        expect(inputedData.desc).toBe("desc-hello-hello")
        expect(inputedData.title).toBe("title-hello-hello")
        expect(inputedData.url).toBe("url-hello-hello")
        expect(inputedData.tags).toEqual(["typescript", "helloworld"])

    });
    

    test("test2", async () => {
        const user = userEvent.setup();
        const findTagMethod_ = vi.fn<FindTagMethod>(async (predicate,inputedTags) => {
            return findTagMethod(predicate,inputedTags)
        });

        const wrapper : React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <HotkeysProvider
                initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
            >
                {children}
            </HotkeysProvider>
        );
        const hook = renderHook(
            () => {
                return useBookmarkForm(
                    vi.fn(),
                    vi.fn(),
                    findTagMethod_,
                    vi.fn()
                );
            },
            { wrapper }
        );

        render(
            <HotkeysProvider
                initiallyActiveScopes={[HOTKEY_SCOPES.CREATE_NEW_BOOKMARK]}
            >
                <BookmarkForm {...hook.result.current.props}></BookmarkForm>
            </HotkeysProvider>
        );
        
        const inputTagBox: HTMLInputElement = screen.getByPlaceholderText("/")

        await user.type(inputTagBox,"hello ");
        let inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello"])

        await user.type(inputTagBox,"hello ");
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello"])

        await user.type(inputTagBox,"hello ");
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello"])

        await user.type(inputTagBox,"    hello    hello   ");
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello"])
        
        await user.type(inputTagBox,"helloworld ");
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello", "helloworld"])
        
        await user.type(inputTagBox,"{Backspace}")
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual(["hello"])

        await user.type(inputTagBox,"{Backspace}")
        inputedData = hook.result.current.getInputData()
        expect(inputedData.tags).toEqual([])
    });
    
});
