import { JSDOM } from "jsdom";

/**
 * URLの内容を取得する関数
 * @param url 取得するURL
 * @returns HTML文字列
 */
export async function fetchWebsiteContent(url: string) {
    let html = await fetch(url, { method: "GET" }).then((response) => response.text());
    let result = parseHTMLMetaData(html);
    return result
}

/**
 * HTMLを解析してタイトルと説明を取得する関数
 * @param html HTML文字列
 * @returns タイトルと説明
 */
function parseHTMLMetaData(html: string) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const title = document.querySelector("title")?.textContent || null;
    const description =
        document.querySelector('meta[name="description"]')?.getAttribute("content") || null;

    return { title, description };
}


export const __test__export_fetchWebsiteContent = {
    parseHTMLMetaData,
}