#[derive(serde::Serialize)]
pub struct WebSiteContent {
    title: Option<String>,
    desc: Option<String>,
}

#[tauri::command]
pub fn fetch_website_content(url: String) -> Result<WebSiteContent, String> {
    let response = reqwest::blocking::get(&url).map_err(|e| e.to_string())?;
    let html = response.text().map_err(|e| e.to_string())?;
    let website_content = parse_html(&html).map_err(|e| e.to_string())?;
    Ok(website_content)
}

fn parse_html(html: &str) -> Result<WebSiteContent, Box<dyn std::error::Error>> {
    let document = scraper::Html::parse_document(html);

    let title_selector = scraper::Selector::parse("title")?;
    let desc_selector = scraper::Selector::parse("meta[name='description']")?;

    let title = document
        .select(&title_selector)
        .next()
        .map(|element| element.inner_html());

    let desc = document
        .select(&desc_selector)
        .next()
        .map(|element| element.value().attr("content").unwrap_or("").to_string());

    Ok(WebSiteContent { title, desc })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_html() {
        let html = r#"
            <html>
                <head>
                    <title>test title</title>
                </head>
                <body>
                    <h1>test content</h1>
                </body>
            </html>
        "#;

        let result = parse_html(html).unwrap();
        assert_eq!(result.desc, None);
        assert_eq!(result.title, Some("test title".to_string()));

        let html = r#"
            <html>
                <head>
                    <title>test title</title>
                    <meta name="description" content="test description">
                </head>
                <body>
                    <h1>test content</h1>
                </body>
            </html>
        "#;

        let result = parse_html(html).unwrap();
        assert_eq!(result.desc, Some("test description".to_string()));
        assert_eq!(result.title, Some("test title".to_string()));

        let html = r#"
            <html>
                <head>
                    <meta name="description" content="test description">
                </head>
                <body>
                    <h1>test content</h1>
                </body>
            </html>
        "#;

        let result = parse_html(html).unwrap();
        assert_eq!(result.desc, Some("test description".to_string()));
        assert_eq!(result.title, None);

        let html = "not a valid html";
        let result = parse_html(html).unwrap();
        assert_eq!(result.desc, None);
        assert_eq!(result.title, None);
    }
}
