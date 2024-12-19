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

    it("シングルクォーテーションでも動作する", () => {
        const html = `
      <html>
        <head>
          <title>Sample Title</title>
          <meta name='description' content="Sample Description">
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

    it("タイトルがない場合はnull値を返す", () => {
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
    

    it("適当なデータを渡してもエラーにならない", () => {
        const html = "This is not an HTML document.";
        const result = parseHTMLMetaData(html);
        expect(result).toEqual({
            title: null,
            description: null,
        });
    })
    
    it("内部のJavaScriptが実行されない", () => {
        const html = `
      <html>
        <head>
          <title>Sample Title</title>
          <script>
            document.write("<meta name='description' content='Sample Description'>");
          </script>
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
    })
    
    it("HTMLが空の場合はnullを返す", () => {
        const html = "";
        const result = parseHTMLMetaData(html);
        expect(result).toEqual({
            title: null,
            description: null,
        });
    })
});