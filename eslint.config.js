import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist","src-tauri"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                tsconfigRootDir: ".",
                project: "./tsconfig.json", // tsconfig.jsonのパス
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },

        // 基準
        // warn : 良くないコード
        // error: 動かないコード
        rules: {
            ...reactHooks.configs.recommended.rules,
            "@typescript-eslint/no-namespace": "off",
            "react-hooks/exhaustive-deps": "off",
            "prefer-const": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/strict-boolean-expressions": [
                "warn",
                {
                    allowString: false,
                    allowNumber: false,
                    allowNullableObject: false,
                },
            ],
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    }
);
