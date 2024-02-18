// エラー処理以外のifを使ってはいけない
// for はだめ
// 処理の中身は別のところに書く

import { InputTagElm, clear_input_box, get_inputed_tags, handle_backspace_on_input_tag_box, insert_tag, insert_tag_not_complement } from "../sub/input_tag";
import { TagSuggestionWindowElm, done_suggestion, handle_input_tagbox, move_focus_tag_suggestion_window } from "../sub/tag_suggestion";
import * as SB from '../sub/searched_bookmarks'
import { RootElement } from "../html/html";
import { switch_page } from "../app/page";
import { BookmarkForm, check_inputed_data, clear_form as clear_bookmark_form, complement_form, parse_inputed_data } from "../app/bkmk_form";
import { EditBookmarkPageElm, clear_edit_page, parse_edit_page_form, set_bookmark_data_into_edit_page } from "../app/edit_bookmark";
import { HitTagList } from "../sub/hit_tag_list";

export namespace AnyPage {
    export function focus_up_tag_suggestion(
        win: TagSuggestionWindowElm
    ) {
        let result = move_focus_tag_suggestion_window("up", win)
    }

    export function focus_down_tag_suggestion(
        win: TagSuggestionWindowElm
    ) {
        let result = move_focus_tag_suggestion_window("down", win)
    }

    export async function handle_input_input_tag_box(
        e: Event,
        f: f_FetchSuggestion,
        win: TagSuggestionWindowElm,
    ) {
        if (e.target === null || !(e.target instanceof HTMLInputElement)) {
            return
        }

        let result = await handle_input_tagbox(
            f, win, e.target
        )

        if (result !== null) {
            return
        }
    }

    export function handle_keydown_input_tag_box(
        e: KeyboardEvent,
        input_tag: InputTagElm
    ) {
        if (e.key === "Backspace") {
            handle_backspace_on_input_tag_box(input_tag)
        }
    }

    export function handle_keyup_input_tag_box(
        e: KeyboardEvent,
        f: f_TagExistsDB,
        input_tag: InputTagElm
    ) {
        if (e.key == " " && e.isComposing === false) {
            insert_tag_not_complement(input_tag, f)
        }
    }

    export async function tag_complement(
        win: TagSuggestionWindowElm,
        input_tag: InputTagElm,
        f: f_TagExistsDB
    ) {
        let tag = done_suggestion(win)
        if (tag instanceof Error) {
            throw tag
        }
        let exists = await f(tag)
        insert_tag(input_tag, tag, exists)
        clear_input_box(input_tag)
    }

    export async function goto_edit_bookmark_page(
        target_data: BookmarkData,
        root: RootElement,
        f: f_FetchTagsWhereLinkBkmk
    ) {
        let tags = await f(target_data.id)
        if (tags.err !== null) {
            return
        }

        set_bookmark_data_into_edit_page(
            root.edit_bkmk,
            target_data,
            tags.tags
        )

        switch_page(root, "edit_bkmk")
    }

    export async function remove_bookmark(
        target_data: BookmarkData,
        f: f_RemoveBookmark,
    ) {
        let input = confirm(target_data.title + " を削除します。この操作は取り消せません")
        if (input === false) {
            return
        }
        let result = await f(target_data)
        if (result.err !== null) {
            throw result.err
        }
    }
}

export namespace Home {
    export async function reload_bookmarks(
        input_tag: InputTagElm,
        f: f_SearchBookmarks,
        fetch_hit_tags: f_FetchHitTags,
        hit_tag_list: HitTagList.Elm,
        searched_bookmark_list: SB.SearchedBookmarkListElm,
        handle_click_edit_bkmk: (data: BookmarkData) => void,
        handle_click_delete_bkmk: (data: BookmarkData) => void

    ) {
        let tags = get_inputed_tags(input_tag)
        let bkmks = await f(tags)
        SB.insert_searched_bookmarks(
            bkmks,
            searched_bookmark_list,
            handle_click_edit_bkmk,
            handle_click_delete_bkmk
        )

        HitTagList.reload(tags,fetch_hit_tags,hit_tag_list)
    }

    export function focus_up_bookmarklist(
        elm: SB.SearchedBookmarkListElm
    ) {
        SB.move_focus_searched_bookmarks("up", elm)
    }

    export function focus_down_bookmarklist(
        elm: SB.SearchedBookmarkListElm
    ) {
        SB.move_focus_searched_bookmarks("down", elm)
    }

    export function focus_input_tag_box(input_tag: InputTagElm) {
        input_tag.input_box.focus()
    }

    export function open_bookmark(
        f: f_OpenBookmark,
        elm: SB.SearchedBookmarkListElm
    ) {
        let target_bkmk = SB.get_focued_elm_or_first_elm(elm)
        if (target_bkmk === null) {
            return
        }

        f(target_bkmk.id)
    }

    export function goto_add_page(
        root: RootElement
    ) {
        switch_page(root, "add")
    }
}


export namespace Add {
    export function go_home(root: RootElement) {
        switch_page(root, "home")
    }

    export function focus_input_tag_box(input_tag: InputTagElm) {
        input_tag.input_box.focus()
    }

    export async function add_bookmark(
        form: BookmarkForm,
        f: f_AddBookmark,
    ) {
        let data = parse_inputed_data(form)
        let errors = check_inputed_data(data)

        if (errors.length !== 0) {
            // TODO
            return
        }

        let result = await f(
            data.url,
            data.title,
            data.tags,
            data.description
        )

        if (result.err) {
            return
        }

        clear_bookmark_form(form)
    }

    export async function complement_form_from_url(
        form: BookmarkForm,
        f: f_FetchPageInfo
    ) {
        let data = await f(form.url_box.value)
        if (data === null) {
            return
        }
        complement_form(data, form)
    }
}

export namespace EditBkmk {
    export function go_home(root: RootElement) {
        clear_edit_page(root.edit_bkmk)
        switch_page(root, "home")
    }

    export function focus_input_tag_box(input_tag: InputTagElm) {
        input_tag.input_box.focus()
    }

    export async function update_bkmk(
        page: EditBookmarkPageElm,
        f: f_UpdateBookmark,
        root: RootElement,
    ) {
        let data = parse_edit_page_form(page)
        if (data instanceof Error) {
            throw data
        }

        let res = await f(data.data, data.tags)
        console.table(res)
        if (res.err !== null) {
            throw res.err
        }

        clear_edit_page(page)
        switch_page(root, "home")
    }
}