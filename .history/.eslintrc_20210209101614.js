module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        semi: false, // 未尾逗号
        vueIndentScriptAndStyle: true,
        singleQuote: true, // 单引号
        quoteProps: 'as-needed',
        bracketSpacing: true,
        trailingComma: 'none', // 未尾分号
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        arrowParens: 'always',
        insertPragma: false,
        requirePragma: false,
        proseWrap: 'never',
        htmlWhitespaceSensitivity: 'strict'
      }
    ],
    'vue/no-unused-vars': 'error',
    'vue/no-multiple-template-root': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn'
  }
}
