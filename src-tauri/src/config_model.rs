// Jsonの変数はキャメルケースで定義する
#![allow(non_snake_case)]

use serde::{Deserialize, Serialize};
use serde_inline_default::serde_inline_default;
use ts_rs::TS;

mod color_palette {
    pub(super) fn verydark() -> String {
        "#1a1b25".to_string()
    }
    pub(super) fn dark1() -> String {
        "#1f2335".to_string()
    }
    pub(super) fn dark2() -> String {
        "#24283b".to_string()
    }
    pub(super) fn dark3() -> String {
        "#292e42".to_string()
    }
    pub(super) fn dark6() -> String {
        "#545c7e".to_string()
    }
    pub(super) fn blue3() -> String {
        "#394b70".to_string()
    }
    pub(super) fn blue5() -> String {
        "#7aa2f7".to_string()
    }
    pub(super) fn purple1() -> String {
        "#bb9af7".to_string()
    }
    pub(super) fn yellow1() -> String {
        "#ffc777".to_string()
    }
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "export/Config.d.ts")]
pub struct Config {
    #[serde(default = "default_color_theme")]
    colorTheme: ColorTheme,

    #[serde(default = "default_keybinds")]
    keybinds: Keybinds,
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "export/Keybinds.d.ts")]
pub struct Keybinds {
    #[serde_inline_default(Keys::Keys(Vec::from(["ctrl+n".to_string(),"ArrowDown".to_string()])))]
    focusDownBookmarkList: Keys,

    #[serde_inline_default(Keys::Keys(Vec::from(["ctrl+p".to_string(),"ArrowUp".to_string()])))]
    focusUpBookmarkList: Keys,

    #[serde_inline_default(Keys::Key("Escape".to_string()))]
    closeWindow: Keys,

    #[serde_inline_default(Keys::Keys(Vec::from(["ctrl+n".to_string(),"ArrowDown".to_string()])))]
    focusDownSuggestionWindow: Keys,

    #[serde_inline_default(Keys::Keys(Vec::from(["ctrl+p".to_string(),"ArrowUp".to_string()])))]
    focusUpSuggestionWindow: Keys,

    // placeholderに書いちゃってるし、keyupが複雑だからこいつは固定。
    // #[serde_inline_default(Keys::Key("/".to_string()))]
    // focusPredicateInputBox: Keys,

    #[serde_inline_default(Keys::Key("Enter".to_string()))]
    addFocusedSuggestionItem: Keys,

    #[serde_inline_default(Keys::Key("Backspace".to_string()))]
    popInputedTag: Keys,

    #[serde_inline_default(Keys::Key("Escape".to_string()))]
    closeSuggestionWindow: Keys,

    #[serde_inline_default(Keys::Key("ctrl+a".to_string()))]
    navigateCreateNewBookmark: Keys,

    #[serde_inline_default(Keys::Key("Enter".to_string()))]
    openUrl: Keys,

    // --- create new bookmark --- //
    #[serde_inline_default(Keys::Key("Escape".to_string()))]
    cancelCreateNewBookmark: Keys,

    #[serde_inline_default(Keys::Key("ctrl+Enter".to_string()))]
    doneCreateNewBookmark: Keys,

    #[serde_inline_default(Keys::Key("Space".to_string()))]
    takeInputTag: Keys,
}
fn default_keybinds() -> Keybinds {
    serde_json::from_str("{}").expect("Failed to parse default keybinds")
}

#[derive(Serialize, Deserialize, TS, Clone)]
#[serde(untagged)]
enum Keys {
    Key(String),
    Keys(Vec<String>),
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "export/ColorTheme.d.ts")]
pub struct ColorTheme {
    #[serde(default = "default_add_button_color_theme")]
    addButton: AddButton,
    #[serde(default = "default_bookmark_item_color_theme")]
    bookmarkItem: BookmarkItemColorTheme,

    #[serde(default = "default_suggestion_window")]
    suggestionWindow: SuggestionWindow,

    #[serde(default = "default_predicate_input_box")]
    predicateInputBox: PredicateInputBox,

    #[serde(default = "default_tag_item")]
    tagItem: TagItem,
    
    #[serde(default = "default_create_new_bookmark")]
    createNewBookmark: CreateNewBookmark,

    #[serde(default = "color_palette::dark2")]
    bg: String,
}
fn default_color_theme() -> ColorTheme {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct AddButton {
    #[serde(default = "color_palette::blue5")]
    pub borderColor: String,
    #[serde(default = "color_palette::dark1")]
    pub bgColor: String,
    #[serde(default = "color_palette::blue5")]
    pub color: String,
}
fn default_add_button_color_theme() -> AddButton {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct BookmarkItemColorTheme {
    #[serde(default = "color_palette::purple1")]
    pub tag: String,
    #[serde(default = "color_palette::blue5")]
    pub title: String,
    #[serde(default = "color_palette::blue3")]
    pub desc: String,
    #[serde(default = "color_palette::dark1")]
    pub bg: String,
    #[serde(default = "color_palette::dark3")]
    pub focusBg: String,
}
fn default_bookmark_item_color_theme() -> BookmarkItemColorTheme {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct SuggestionWindow {
    #[serde(default = "color_palette::dark1")]
    pub bg: String,
    #[serde(default = "color_palette::dark3")]
    pub focusBg: String,
    #[serde(default = "color_palette::verydark")]
    pub borderColor: String,
    #[serde_inline_default("rgb(200,230,255)".to_string())]
    pub r#match: String,
    #[serde(default = "color_palette::dark6")]
    pub unmatch: String,
}
fn default_suggestion_window() -> SuggestionWindow {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct TagItem {
    #[serde(default = "color_palette::dark1")]
    pub bg: String,
    #[serde(default = "color_palette::blue3")]
    pub borderColor: String,
    #[serde(default = "color_palette::purple1")]
    pub exists: String,
    #[serde(default = "color_palette::yellow1")]
    pub notExists: String,
}
fn default_tag_item() -> TagItem {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct PredicateInputBox {
    #[serde(default = "color_palette::verydark")]
    pub bg: String,

    #[serde_inline_default("white".to_string())]
    pub textColor: String,

    #[serde(default = "color_palette::dark6")]
    pub placeholder: String,

    #[serde_inline_default("white".to_string())]
    pub caretColor: String,
}
fn default_predicate_input_box() -> PredicateInputBox {
    serde_json::from_str("{}").expect("Failed to parse default config")
}


#[serde_inline_default]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct CreateNewBookmark {
    #[serde_inline_default("white".to_string())]
    pub textColor: String,

    #[serde(default = "color_palette::dark6")]
    pub placeholder: String,

    #[serde_inline_default("white".to_string())]
    pub caretColor: String,
}
fn default_create_new_bookmark() -> CreateNewBookmark {
    serde_json::from_str("{}").expect("Failed to parse default config")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = serde_json::from_str::<Config>("{}").unwrap();

        let expected = Config {
            colorTheme: ColorTheme {
                addButton: AddButton {
                    borderColor: color_palette::blue5(),
                    color: color_palette::blue5(),
                    bgColor: color_palette::dark1(),
                },
                bookmarkItem: BookmarkItemColorTheme {
                    tag: color_palette::purple1(),
                    title: color_palette::blue5(),
                    desc: color_palette::blue3(),
                    bg: color_palette::dark1(),
                    focusBg: color_palette::dark3(),
                },
                suggestionWindow: SuggestionWindow {
                    bg: color_palette::dark1(),
                    focusBg: color_palette::dark3(),
                    borderColor: color_palette::verydark(),
                    r#match: "rgb(200,230,255)".to_string(),
                    unmatch: color_palette::dark6(),
                },
                predicateInputBox: PredicateInputBox {
                    bg: color_palette::verydark(),
                    textColor: "white".to_string(),
                    placeholder: color_palette::dark6(),
                    caretColor: "white".to_string(),
                },
                createNewBookmark: CreateNewBookmark {
                    caretColor: "white".to_string(),
                    placeholder: color_palette::dark6(),
                    textColor: "white".to_string(),
                },
                tagItem: TagItem {
                    bg: color_palette::dark1(),
                    borderColor: color_palette::blue3(),
                    exists: color_palette::purple1(),
                    notExists: color_palette::yellow1(),
                },
                bg: color_palette::dark2(),
            },
            keybinds: Keybinds {
                focusDownBookmarkList: Keys::Keys(Vec::from(["ctrl+n".to_string(),"ArrowDown".to_string()])),
                focusUpBookmarkList: Keys::Keys(Vec::from(["ctrl+p".to_string(),"ArrowUp".to_string()])),
                closeWindow: Keys::Key("Escape".to_string()),
                focusDownSuggestionWindow: Keys::Keys(Vec::from(["ctrl+n".to_string(),"ArrowDown".to_string()])),
                focusUpSuggestionWindow: Keys::Keys(Vec::from(["ctrl+p".to_string(),"ArrowUp".to_string()])),
                addFocusedSuggestionItem: Keys::Key("Enter".to_string()),
                popInputedTag: Keys::Key("Backspace".to_string()),
                closeSuggestionWindow: Keys::Key("Escape".to_string()),
                navigateCreateNewBookmark: Keys::Key("ctrl+a".to_string()),
                openUrl: Keys::Key("Enter".to_string()),
                cancelCreateNewBookmark: Keys::Key("Escape".to_string()),
                doneCreateNewBookmark: Keys::Key("ctrl+Enter".to_string()),
                takeInputTag: Keys::Key("Space".to_string()),
            },
        };

        assert_eq!(
            serde_json::to_string(&config).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }

    #[test]
    fn test_config1() {
        let config_text = r#"
        {
            "colorTheme": {
                "bookmarkItem": {
                    "tag": "red"
                }
            },
            "keybinds": {
                "takeInputTag": "Enter",
                "openUrl": ["ctrl+o"]
            }
        }
        "#;
        let config = serde_json::from_str::<Config>(config_text).unwrap();
        let mut expected = serde_json::from_str::<Config>("{}").unwrap();
        expected.colorTheme.bookmarkItem.tag = "red".to_string();
        expected.keybinds.takeInputTag = Keys::Key("Enter".to_string());
        expected.keybinds.openUrl = Keys::Keys(vec!["ctrl+o".to_string()]);

        assert_eq!(
            serde_json::to_string(&config).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }
}
