module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
  ],
  rules: {
    "vue/no-unused-vars": "error",
    "vue/no-multiple-template-root": "off",
    "no-console": "warn",
    "no-debugger": "warn",
  }
}
