import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard/index.tsx'

const routes: any[] = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('@/views/Design/index.vue')
  },
  {
    path: '/show',
    name: 'show',
    component: () => import('@/views/Show/index.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes: routes
})
