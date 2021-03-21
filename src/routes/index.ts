import { createRouter, createWebHashHistory } from 'vue-router'
import Frame from '@/layout/index.vue'
import { getToken, removeToken } from '@/utils/token'
import store from '@/store/index'

const routes: any[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue')
  },
  { path: '/', redirect: '/main' },
  {
    path: '/main',
    redirect: '/main/dashboard',
    component: Frame,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard')
      },
      { path: 'me', name: 'me', component: () => import('@/views/Me/index.vue') },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/Report/index.vue'),
        children: [
          {
            path: ':id',
            component: () => import('@/views/Report/Report.vue')
          }
        ]
      },
      // {
      //   path: 'show',
      //   name: 'show',
      //   component: () => import('@/views/Show/index.vue'),
      //   children: [
      //     {
      //       path: ':id',
      //       component: () => import('@/views/Show/Report.vue')
      //     }
      //   ]
      // },
      {
        path: 'ds',
        name: 'ds',
        component: () => import('@/views/Data/index.vue'),
        children: [
          {
            path: ':id',
            component: () => import('@/views/Data/DataSource/Editor.vue')
          }
        ]
      },
      {
        path: 'db',
        name: 'db',
        component: () => import('@/views/Data/index.vue'),
        children: [
          {
            path: ':id',
            component: () => import('@/views/Data/Database/Editor.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

// 不需要token的白名单
const whiteList = ['/login', '/404']

router.beforeEach(async to => {
  const hasToken = getToken()
  if (hasToken) {
    if (store.getters.user) {
      // 没有return, 等于next()
    } else {
      //虽然有token, 但是没有登录用户, 先获取用户
      await store.dispatch('auth/getProfile')
      if (!store.getters.user) {
        //如果获取失败, 删除token, 跳回登录,
        removeToken()
        return `/login?redirect=${to.path}`
      } else {
        // 没有return, 等于next()
      }
    }
    // NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) === -1) {
      return `/login?redirect=${to.path}`
    }
  }
})

router.afterEach(() => {
  // NProgress.done()
})

export default router
