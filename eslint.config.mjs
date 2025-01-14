import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["dist/*.js", "node_modules/*"],
}, ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
), {
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            experimentalDecorators: true,
        },
    },

    rules: {
        "@typescript-eslint/camelcase": 0,

        "no-console": ["error", {
            allow: ["warn"],
        }],
    },
}];