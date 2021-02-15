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
    component: () => import('@/views/Design/index.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/Design/Report.vue')
      }
    ]
  },
  {
    path: '/show',
    name: 'show',
    component: () => import('@/views/Show/index.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/Show/Report.vue')
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes: routes
})
