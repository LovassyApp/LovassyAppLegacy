module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    rules: {
        indent: ["warn", 4],
        quotes: ["warn", "double"],
        semi: ["warn", "always"],
        eqeqeq: "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "prefer-const": "warn",
        "prefer-arrow-callback": "error",
        "no-const-assign": "error",
        "prefer-object-spread": "warn",
        "prefer-destructuring": "warn",
        "template-curly-spacing": ["warn", "never"],
        "prefer-template": "warn",
        "func-style": ["error", "declaration", {allowArrowFunctions: true}],
        "@typescript-eslint/array-type": ["warn", {default: "array-simple"}],
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
        "wrap-iife": ["error", "inside"],
        "prefer-rest-params": "warn",
        "default-param-last": "error",
        "no-new-func": "error",
        "no-param-reassign": "error",
        "prefer-spread": "warn",
        "arrow-spacing": "warn",
        "no-confusing-arrow": "warn",
        "no-useless-constructor": "error",
        "no-dupe-class-members": "error",
        "no-duplicate-imports": "warn",
        "dot-notation": "warn",
        "one-var": ["warn", "never"],
        "no-multi-assign": "error",
        "no-unneeded-ternary": "warn",
        "brace-style": "warn",
        "no-else-return": "warn",
        "spaced-comment": ["warn", "always", {exceptions: ["*", "!", "?"]}],
        "space-before-blocks": "warn",
        "space-infix-ops": "warn",
        "eol-last": "warn",
        "newline-per-chained-call": "warn",
        "no-whitespace-before-property": "warn",
        "padded-blocks": ["warn", "never"],
        "space-in-parens": "warn",
        "array-bracket-spacing": "warn",
        "object-curly-spacing": ["warn", "always"],
        "block-spacing": "warn",
        "computed-property-spacing": "warn",
        "func-call-spacing": "warn",
        "key-spacing": "warn",
        "no-trailing-spaces": "warn",
        "comma-style": "warn",
        "no-underscore-dangle": "warn",
        "jsx-quotes": "warn",
        "no-empty": "warn",
        "react/jsx-tag-spacing": ["warn", {beforeClosing: "never"}],
        "react/jsx-boolean-value": ["warn", "always"],
        "react/no-array-index-key": "warn",
        "react/jsx-wrap-multilines": "warn",
        "react/self-closing-comp": "warn",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
        "@typescript-eslint/explicit-member-accessibility": ["warn", {accessibility: "explicit"}],
        "@typescript-eslint/method-signature-style": ["warn", "method"],
        "@typescript-eslint/no-confusing-non-null-assertion": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-invalid-void-type": "error",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/unified-signatures": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
    },
};
