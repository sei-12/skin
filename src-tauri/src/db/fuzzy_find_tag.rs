use fuzzy_matcher::skim::SkimMatcherV2;
use fuzzy_matcher::FuzzyMatcher;
use std::cmp::Reverse;
use std::vec;

use super::models::TagRecord;

pub fn fuzzy_find_tag<'a>(
    predicate: &str,
    tags: &'a [TagRecord],
    max_length: usize,
) -> Vec<Vec<(&'a str, bool)>> {
    let matcher = SkimMatcherV2::default();

    let mut filted_tags: Vec<_> = tags
        .iter()
        .filter_map(|tag_record| {
            matcher
                .fuzzy_match(&tag_record.name, predicate)
                .map(|score| (&tag_record.name, score))
        })
        .collect();

    filted_tags.sort_by_key(|x| Reverse(x.1));

    filted_tags
        .iter()
        .take(max_length)
        .map(|x| split_blocks(predicate, x.0))
        .collect()
}

fn split_blocks<'a>(predicate: &str, tag: &'a str) -> Vec<(&'a str, bool)> {
    if predicate.is_empty() || tag.is_empty() {
        return vec![];
    }

    let mut blocks = Vec::new();
    let mut predicate_chars = predicate.chars().peekable();
    let mut prev_is_match: Option<bool> = None;
    let mut right = 0;
    let mut left = 0;

    for t in tag.chars() {
        right += 1;
        let tag_char = t.to_ascii_lowercase();

        let p_char = predicate_chars.peek().map(|x| x.to_ascii_lowercase());
        let is_match = Some(tag_char) == p_char;

        if is_match {
            predicate_chars.next();
        }

        let Some(p_is_m) = prev_is_match else {
            prev_is_match = Some(is_match);
            continue;
        };

        if is_match != p_is_m {
            blocks.push((&tag[left..right - 1], p_is_m));
            prev_is_match = Some(!p_is_m);
            left = right - 1;
        }
    }

    let Some(p_is_m) = prev_is_match else {
        return vec![];
    };
    blocks.push((&tag[left..right], p_is_m));

    blocks
}

#[cfg(test)]
mod tests {
    use crate::db::{fuzzy_find_tag::split_blocks, models::TagRecord};

    use super::fuzzy_find_tag;

    #[test]
    fn test_split_blocks() {
        assert_eq!(
            split_blocks("hello", "helloworld"),
            vec![("hello", true), ("world", false)]
        );

        assert_eq!(
            split_blocks("hello", "worldhelloworld"),
            vec![("world", false), ("hello", true), ("world", false)]
        );

        assert_eq!(
            split_blocks("02468", "0123456789"),
            vec![
                ("0", true),
                ("1", false),
                ("2", true),
                ("3", false),
                ("4", true),
                ("5", false),
                ("6", true),
                ("7", false),
                ("8", true),
                ("9", false)
            ]
        );

        assert_eq!(
            split_blocks("HELLO", "worldhelloworld"),
            vec![("world", false), ("hello", true), ("world", false)]
        );

        assert_eq!(
            split_blocks("HELLO", "worldHelLOworld"),
            vec![("world", false), ("HelLO", true), ("world", false)]
        );

        assert_eq!(
            split_blocks("heLlO", "worldHelLOworld"),
            vec![("world", false), ("HelLO", true), ("world", false)]
        );

        assert_eq!(split_blocks("", "worldHelLOworld"), vec![]);

        assert_eq!(split_blocks("hellow", ""), vec![]);

        assert_eq!(
            split_blocks("hello", "HaeBlcLdoe"),
            vec![
                ("H", true),
                ("a", false),
                ("e", true),
                ("B", false),
                ("l", true),
                ("c", false),
                ("L", true),
                ("d", false),
                ("o", true),
                ("e", false)
            ]
        );
    }

    #[test]
    fn test_fuzy_find_tag() {
        let tag_records = [
            TagRecord {
                id: 1,
                name: "hello".to_string(),
            },
            TagRecord {
                id: 2,
                name: "helloworld".to_string(),
            },
            TagRecord {
                id: 3,
                name: "aaahelloworld".to_string(),
            },
        ];

        let result = fuzzy_find_tag("hello", &tag_records, 10);
        assert_eq!(
            result,
            vec![
                vec![("hello", true)],
                vec![("hello", true), ("world", false)],
                vec![("aaa", false), ("hello", true), ("world", false)],
            ]
        );

        let tag_records = [
            TagRecord {
                id: 1,
                name: "hello".to_string(),
            },
            TagRecord {
                id: 2,
                name: "helloworld".to_string(),
            },
            TagRecord {
                id: 3,
                name: "aaahelloworld".to_string(),
            },
            TagRecord {
                id: 4,
                name: "aaa".to_string(),
            },
            TagRecord {
                id: 5,
                name: "hell".to_string(),
            },
        ];

        let result = fuzzy_find_tag("hello", &tag_records, 10);
        assert_eq!(
            result,
            vec![
                vec![("hello", true)],
                vec![("hello", true), ("world", false)],
                vec![("aaa", false), ("hello", true), ("world", false)],
            ]
        );

        let tag_records = [
            TagRecord {
                id: 1,
                name: "HELLO".to_string(),
            },
            TagRecord {
                id: 2,
                name: "helloworld".to_string(),
            },
            TagRecord {
                id: 3,
                name: "aaahelloworld".to_string(),
            },
            TagRecord {
                id: 4,
                name: "aaa".to_string(),
            },
            TagRecord {
                id: 5,
                name: "hell".to_string(),
            },
        ];
        let result = fuzzy_find_tag("hello", &tag_records, 10);
        assert_eq!(
            result,
            vec![
                vec![("hello", true), ("world", false)],
                vec![("HELLO", true)],
                vec![("aaa", false), ("hello", true), ("world", false)],
            ]
        );
    }
}
