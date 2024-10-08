/*
 * @Description: 访问权限状态管理
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import router, { constantRoutes } from '@/router';
import type { PermissionState, PermissionMenuData } from '@/types/store';
import { formatRouter, filterAsyncRoutes } from '@/common/utils';
import service from '@/common/request/http';

const useStore = defineStore({
  id: 'permission',

  // 基本状态数据
  state: (): PermissionState => ({
    routes: [],
    openeds: []
  }),

  // 从基本数据(state)派生的数据
  getters: {},

  // 提交更新数据的方法(异步)
  actions: {
    // 设置路由
    setRoutes(routes: any[]) {
      this.routes = constantRoutes.concat(routes);
    },

    // 设置默认展开的菜单
    setOpeneds(value: string) {
      this.openeds.push(value);
    },

    // 获取路由数据并生成路由菜单
    generateRoutes(token: string, roles: string[]) {
      return new Promise((resolve, reject) => {
        service
          .get(`/role/getAllControllers`)
          .then((res: any) => {
            const data: any = res.data || [];
            // 处理菜单数据
            const dataMap = data.map((item: PermissionMenuData) => {
              return {
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                path: item.path,
                component: item.component,
                redirect: item.redirect,
                meta: {
                  hidden: item.hidden,
                  alwaysShow: item.alwaysShow,
                  roles: item.roles,
                  title: item.title,
                  icon: item.icon,
                  noCache: item.noCache,
                  breadcrumb: item.breadcrumb,
                  affix: item.affix,
                  noTags: item.noTags,
                  open: item.open,
                  activeMenu: item.activeMenu,
                  isShow: item.isShow
                }
              };
            });

            // 格式化路由
            const routes = formatRouter(dataMap);
            // 根据角色权限过虑动态路由
            const routerMap = filterAsyncRoutes(routes, roles);
            // 添加路由
            routerMap.forEach((item: any) => {
              router.addRoute(item);
            });

            // 获取默认展开的菜单并保存
            router.getRoutes().forEach((item: RouteRecordRaw) => {
              if (item.meta?.open) {
                this.setOpeneds(item.path);
              }
            });

            // 在动态路由添加后，在将404添加入，解决刷新是找不到路由跳转404
            router.addRoute({
              path: '/:pathMatch(.*)',
              redirect: '/404',
              meta: {
                hidden: true,
                noTags: true
              }
            });

            this.setRoutes(routerMap);
            resolve(routerMap);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
});

export default useStore;
