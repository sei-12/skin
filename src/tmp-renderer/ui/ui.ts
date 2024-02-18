// エラー処理以外のifを使ってはいけない
// for はだめ
// 処理の中身は別のところに書く

import { InputTagElm, clear_input_box, get_inputed_tags, handle_backspace_on_input_tag_box, insert_tag, insert_tag_not_complement } from "../app/input_tag";
import { TagSuggestionWindowElm, done_suggestion, handle_input_tagbox, move_focus_tag_suggestion_window } from "../app/tag_suggestion";
import * as SB from '../app/searched_bookmarks'
import * as HTL from "../app/hit_tag_list";
import { RootElement } from "../html/html";
import { switch_page } from "../app/page";

export namespace Home {
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
            insert_tag_not_complement(input_tag,f)
        }
    }

    export async function handle_mut_tag_list(
        input_tag: InputTagElm,
        f: f_SearchBookmarks,
        fetch_hit_tags: f_FetchHitTags,
        hit_tag_list: HTL.HitTagListElm,
        searched_bookmark_list: SB.SearchedBookmarkListElm
    ) {
        let tags = get_inputed_tags(input_tag)
        let bkmks = await f(tags)
        SB.insert_searched_bookmarks(bkmks, searched_bookmark_list)

        HTL.reload_hittaglist_elm(tags, fetch_hit_tags, hit_tag_list)
    }

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
        if ( target_bkmk === null ){
            return
        }

        f(target_bkmk.id)
    }

    export function goto_add_page(
        root: RootElement
    ){
        switch_page(root,"add")
    }
}

