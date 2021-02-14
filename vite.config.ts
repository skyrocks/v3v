// import vue from '@vitejs/plugin-vue'

// /**
//  * https://vitejs.dev/config/
//  * @type {import('vite').UserConfig}
//  */
// export default {
//   plugins: [vue()]
// }

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'
import vueJsx from '@vitejs/plugin-vue-jsx'

const path = require('path')
console.log(path.resolve(__dirname, './src'))

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: 'element-plus',
          style: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`
          }
        }
      ]
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ],
  server: {
    port: 3008
  },
  alias: {
    '@': path.resolve(__dirname, './src')
  }
})