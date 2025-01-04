// Jsonの変数はキャメルケースで定義する
#![allow(non_snake_case)]

use ts_rs::TS;
use serde::{Deserialize, Serialize};
use serde_inline_default::serde_inline_default;

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
    // pub(super) fn dark4() -> String {
    //     "#3b4261".to_string()
    // }
    // pub(super) fn dark5() -> String {
    //     "#414868".to_string()
    // }
    pub(super) fn dark6() -> String {
        "#545c7e".to_string()
    }
    // pub(super) fn dark7() -> String {
    //     "#565f89".to_string()
    // }
    // pub(super) fn dark8() -> String {
    //     "#737aa2".to_string()
    // }
    // pub(super) fn blue1() -> String {
    //     "#a9b1d6".to_string()
    // }
    // pub(super) fn blue2() -> String {
    //     "#c0caf5".to_string()
    // }
    pub(super) fn blue3() -> String {
        "#394b70".to_string()
    }
    // pub(super) fn blue4() -> String {
    //     "#3d59a1".to_string()
    // }
    pub(super) fn blue5() -> String {
        "#7aa2f7".to_string()
    }
    // pub(super) fn blue6() -> String {
    //     "#7dcfff".to_string()
    // }
    // pub(super) fn blue7() -> String {
    //     "#b4f9f8".to_string()
    // }
    pub(super) fn purple1() -> String {
        "#bb9af7".to_string()
    }
    // pub(super) fn purple2() -> String {
    //     "#9d7cd8".to_string()
    // }
    // pub(super) fn orange1() -> String {
    //     "#ff9e64".to_string()
    // }
    pub(super) fn yellow1() -> String {
        "#ffc777".to_string()
    }
    // pub(super) fn green1() -> String {
    //     "#c3e88d".to_string()
    // }
    // pub(super) fn teal1() -> String {
    //     "#4fd6be".to_string()
    // }
    // pub(super) fn teal2() -> String {
    //     "#41a6b5".to_string()
    // }
    // pub(super) fn pink1() -> String {
    //     "#ff757f".to_string()
    // }
    // pub(super) fn red1() -> String {
    //     "#c53b53".to_string()
    // }
    // pub(super) fn magenta1() -> String {
    //     "#ff007c".to_string()
    // }
}

#[serde_inline_default]
#[derive(Serialize, Deserialize,TS)]
#[ts(export, export_to = "export/Config.d.ts")]
pub struct Config {
    #[serde(default = "default_color_theme")]
    colorTheme: ColorTheme,
}

#[serde_inline_default]
#[derive(Serialize, Deserialize,TS)]
#[ts(export,export_to = "export/ColorTheme.d.ts")]
pub struct ColorTheme {
    #[serde(default = "default_bookmark_item_color_theme")]
    bookmarkItem: BookmarkItemColorTheme,

    #[serde(default = "default_suggestion_window")]
    suggestionWindow: SuggestionWindow,
    
    #[serde(default = "default_predicate_input_box")]
    predicateInputBox: PredicateInputBox,
    
    #[serde(default = "default_tag_item")]
    tagItem: TagItem,

    #[serde(default = "color_palette::dark2")]
    bg: String,
}
fn default_color_theme() -> ColorTheme {
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
#[derive(Serialize, Deserialize, Debug, Clone,TS)]
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

#[derive(Serialize, Deserialize, Debug, Clone,TS)]
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

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
pub struct PredicateInputBox {
    #[serde(default = "color_palette::verydark")]
    pub bg: String,
}
fn default_predicate_input_box() -> PredicateInputBox {
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
                },
                tagItem: TagItem {
                    bg: color_palette::dark1(),
                    borderColor: color_palette::blue3(),
                    exists: color_palette::purple1(),
                    notExists: color_palette::yellow1(),
                },
                bg: color_palette::dark2(),
            },
        };
        
        assert_eq!(
            serde_json::to_string(&config).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }
    
    #[test]
    fn test_config1(){
        let config_text = r#"
        {
            "colorTheme": {
                "bookmarkItem": {
                    "tag": "red"
                }
            }
        }
        "#;
        let config = serde_json::from_str::<Config>(config_text).unwrap();
        let mut expected = serde_json::from_str::<Config>("{}").unwrap();
        expected.colorTheme.bookmarkItem.tag = "red".to_string();
        
        assert_eq!(
            serde_json::to_string(&config).unwrap(),
            serde_json::to_string(&expected).unwrap()
        );
    }
}