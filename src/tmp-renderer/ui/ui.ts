// エラー処理以外のifを使ってはいけない
// for はだめ
// 処理の中身は別のところに書く

import { TagSuggestionWindowElm, handle_input_tagbox } from "../app/tag_suggestion";

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

        if ( result !== null ){
            return
        }
    }

    export function handle_keydown_input_tag_box(e: KeyboardEvent) {

    }

    export function handle_keyup_input_tag_box(e: KeyboardEvent) {

    }

    export function handle_mut_tag_list() {

    }

    export function focus_up_tag_suggestion() {

    }

    export function focus_down_tag_suggestion() {

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

