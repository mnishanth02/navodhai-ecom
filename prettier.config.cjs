/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  arrowParens: "always",
  printWidth: 120,
  singleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  proseWrap: "always",
  endOfLine: "lf",
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    "^server-only$",
    "",
    "^(react|next?/?([a-zA-Z/]*))$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};

module.exports = config;
