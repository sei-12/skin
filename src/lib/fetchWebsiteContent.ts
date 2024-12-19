/**
 * URLの内容を取得する関数
 * @param url 取得するURL
 * @returns HTML文字列
 */
export async function fetchWebsiteContent(url: string): Promise<string> {
    try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        throw new Error(`Failed to fetch content from URL: ${error}`);
    }
}

/**
 * HTMLを解析してタイトルと説明を取得する関数
 * @param html HTML文字列
 * @returns タイトルと説明
 */
export function parseHTMLMetaData(html: string)  {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descriptionMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    return { title, description };
}


