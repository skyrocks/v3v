module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        printWidth: 120,
      },
    ],
    "vue/no-unused-vars": "error",
    "vue/no-multiple-template-root": "off",
    "no-console": "warn",
    "no-debugger": "warn",
  }
}
