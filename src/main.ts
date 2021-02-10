import { createApp } from 'vue'
import App from './App.vue'
import { ElButton, ElRow, ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const components: any[] = [ElButton, ElRow]

const plugins: any = [ElLoading, ElMessage, ElMessageBox, ElNotification]

const app = createApp(App)

components.forEach((component: any) => {
  app.component(component.name, component)
})

plugins.forEach((plugin: any) => {
  app.use(plugin)
})

app.mount('#app')
