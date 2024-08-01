/*
 * @Description: 静态路由
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
// 应用布局组件
export const App = (): Promise<any> => import('@/app/index.vue');

export default [
  {
    path: '/redirect',
    component: App,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (): any => import('@/views/public/redirect.vue'),
        meta: {
          hidden: true,
          noTags: true,
          breadcrumb: false
        }
      }
    ]
  },
  {
    path: '/404',
    component: (): any => import('@/views/public/404.vue'),
    meta: {
      title: '404',
      hidden: true,
      noTags: true
    }
  },
  {
    path: '/img/:name',
    component: (): any => import('@/components/tinymce/img.vue'),
    meta: {
      title: 'img',
      hidden: true,
      noTags: true
    }
  },
  {
    path: '/login',
    component: (): any => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      noTags: true
    }
  },
  {
    path: '/',
    component: App,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'House',
      affix: true,
      alwaysShow: true,
      isShow: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: (): any => import('@/views/dashboard/index.vue'),
        meta: {
          title: '控制台',
          // icon: 'House',
          affix: true,
          isShow: true
        }
      }
    ]
  },
  {
    // 找不到路由重定向到404页面
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {
      hidden: true,
      noTags: true
    }
  }
];
