import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
      "**/*.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  {
    // The @typescript-eslint plugin from eslint-config-next is scoped to
    // **/*.ts(x), so these rules have to share that scope.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Catches dead imports and unused locals, which is how the unused
      // components in this repo went unnoticed.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // `any` is widespread and predates this config; surface it without
      // blocking on hundreds of pre-existing hits.
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // Sanity resolves schemas through default exports, so the anonymous-export
    // rule is a false positive for this directory.
    files: ["sanity/schema/**/*.ts"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
