import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElButtonGroup,
  ElButton,
  ElRow,
  ElCol,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElImage,
  ElInput,
  ElAvatar,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElDivider
  // ElTabs,
  // ElTabPane
} from 'element-plus'

const components: any[] = [
  ElButtonGroup,
  ElButton,
  ElRow,
  ElCol,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElImage,
  ElInput,
  ElAvatar,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElDivider
  // ElTabs,
  // ElTabPane
]

const plugins: any = [ElLoading, ElMessage, ElMessageBox, ElNotification]

const app = createApp(App)

app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }

components.forEach((component: any) => {
  app.component(component.name, component)
})

plugins.forEach((plugin: any) => {
  app.use(plugin)
})

app.use(router)

app.config.globalProperties.$message = ElMessage

app.mount('#app')
