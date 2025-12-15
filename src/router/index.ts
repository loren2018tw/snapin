import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [];

export default function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createMemoryHistory(),
  });

  return Router;
}
