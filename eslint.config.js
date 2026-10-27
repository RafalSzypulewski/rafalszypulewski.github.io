import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**"],
  },
  { rules: { "no-console": "error" } },
  { ignores: ["dist/**", ".astro/**", "public/pagefind/**"] },
];
