// 创建路由
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'test',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/test.vue'),
    meta: {
      requiresAuth: false,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
