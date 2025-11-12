import { RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('../views/login/login.vue'),
  },
]
export default routes
