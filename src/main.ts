import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import SvgIcon from '@/components/SvgIcon/index.vue'
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
  ElDivider,
  ElRadioGroup,
  ElRadio,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElCard,
  ElTooltip,
  ElAlert
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
  ElDivider,
  ElRadioGroup,
  ElRadio,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElCard,
  ElTooltip,
  ElAlert
]

const plugins: any = [ElLoading, ElMessage, ElMessageBox, ElNotification]

const app = createApp(App)

components.forEach((component: any) => {
  app.component(component.name, component)
})
plugins.forEach((plugin: any) => {
  app.use(plugin)
})
//默认small尺寸
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }

app.component('SvgIcon', SvgIcon)

app.use(router).use(store)

app.mount('#app')
