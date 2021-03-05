module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    process: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['@/components/SvgIcon/alIcon.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf', //换行符使用 lf
        printWidth: 120, // 超过最大值换行
        useTabs: false, // 缩进不使用tab，使用空格
        tabWidth: 2, // 缩进字节数
        semi: false, // 未尾逗号
        vueIndentScriptAndStyle: false, // vue文件的script标签和Style标签下的内容不需要缩进
        singleQuote: true, // 单引号
        quoteProps: 'as-needed',
        bracketSpacing: true,
        trailingComma: 'none', // 未尾分号
        jsxBracketSameLine: false, // 在jsx中把'>' 是否单独放一行
        jsxSingleQuote: false, // 在jsx中不使用单引号代替双引号
        arrowParens: 'avoid', //箭头函数，只有一个参数的时候，不需要括号
        insertPragma: false,
        requirePragma: false,
        proseWrap: 'never',
        htmlWhitespaceSensitivity: 'strict'
      }
    ],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/custom-event-name-casing': 'off',
    'no-use-before-define': 'off',
    // 'no-use-before-define': [
    //   'error',
    //   {
    //     functions: false,
    //     classes: true,
    //   },
    // ],
    '@typescript-eslint/no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': [
    //   'error',
    //   {
    //     functions: false,
    //     classes: true,
    //   },
    // ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars': [
    //   'error',
    //   {
    //     argsIgnorePattern: '^h$',
    //     varsIgnorePattern: '^h$'
    //   }
    // ],
    // 'no-unused-vars': [
    //   'error',
    //   {
    //     argsIgnorePattern: '^h$',
    //     varsIgnorePattern: '^h$'
    //   }
    // ],
    'space-before-function-paren': 'off',
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],

    'arrow-body-style': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off'
  }
}
