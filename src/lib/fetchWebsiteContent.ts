import { JSDOM } from "jsdom";

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
export function parseHTMLMetaData(html: string) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const title = document.querySelector("title")?.textContent || null;
    const description =
        document.querySelector('meta[name="description"]')?.getAttribute("content") || null;

    return { title, description };
}