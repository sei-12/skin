// エラー処理以外のifを使ってはいけない
// for はだめ
// 処理の中身は別のところに書く

import { InputTagElm, clear_input_box, handle_backspace_on_input_tag_box, insert_tag, insert_tag_not_complement } from "../app/input_tag";
import { TagSuggestionWindowElm, done_suggestion, handle_input_tagbox, move_focus_tag_suggestion_window } from "../app/tag_suggestion";

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
        input_tag: InputTagElm
    ) {
        if (e.key == " " && e.isComposing === false) {
            insert_tag_not_complement(input_tag)
        }
    }

    export function handle_mut_tag_list() {

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

    export function tag_complement(
        win: TagSuggestionWindowElm,
        input_tag: InputTagElm
    ) {
        let tag = done_suggestion(win)
        if (tag instanceof Error) {
            throw tag
        }

        insert_tag(input_tag, tag)
        clear_input_box(input_tag)
    }

    export function focus_up_bookmarklist() {

    }

    export function focus_down_bookmarklist() {

    }

    export function update_searched_bookmark_list() {

    }

    export function open_bookmark() {

    }
}

