import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"], // Apply to these file types
    rules: {
      "react/no-unescaped-entities": "off", // Turn off the rule
      "@next/next/no-img-element": "off",
       '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
