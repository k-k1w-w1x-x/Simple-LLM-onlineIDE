import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    ignores: [
      "dist",
      "node_modules",
      "src/assets/*",
      "src/assets/*",
      "public/*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "vue/multi-word-component-names": "off",
      "no-var": "error",
    },
  },
];