// import vue from '@vitejs/plugin-vue'

// /**
//  * https://vitejs.dev/config/
//  * @type {import('vite').UserConfig}
//  */
// export default {
//   plugins: [vue()]
// }

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'
import vueJsx from '@vitejs/plugin-vue-jsx'

const path = require('path')

const env = loadEnv(process.env.NODE_ENV, process.cwd())
console.log(env)

const config = {
  // base: '/aa/',
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: 'element-plus',
          style: name => {
            return `element-plus/lib/theme-chalk/${name}.css`
          }
        }
      ]
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ],
  css: {
    modules: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss"; @import "@/styles/index.scss";'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3008,
    proxy: {
      '/api': {
        changeOrigin: true,
        rewrite: path => {
          console.log(path)
          return path.replace(/^\/api/, '')
        }
      }
    }
  }
}

export default defineConfig(config)
