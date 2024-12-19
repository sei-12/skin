import { describe, it, expect } from "vitest";
import { parseHTMLMetaData } from "./fetchWebsiteContent";

describe("parseHTMLMetaData", () => {
    it("正しいタイトルと説明を取得できる", () => {
        const html = `
      <html>
        <head>
          <title>Sample Title</title>
          <meta name="description" content="Sample Description">
        </head>
        <body>
          <p>Sample Content</p>
        </body>
      </html>
    `;
        const result = parseHTMLMetaData(html);
        expect(result).toEqual({
            title: "Sample Title",
            description: "Sample Description",
        });
    });

    it("説明がない場合はnullを返す", () => {
        const html = `
      <html>
        <head>
          <title>Sample Title</title>
        </head>
        <body>
          <p>Sample Content</p>
        </body>
      </html>
    `;
        const result = parseHTMLMetaData(html);
        expect(result).toEqual({
            title: "Sample Title",
            description: null,
        });
    });

    it("タイトルがない場合はデフォルト値を返す", () => {
        const html = `
      <html>
        <head>
          <meta name="description" content="Sample Description">
        </head>
        <body>
          <p>Sample Content</p>
        </body>
      </html>
    `;
        const result = parseHTMLMetaData(html);
        expect(result).toEqual({
            title: null,
            description: "Sample Description",
        });
    });
});