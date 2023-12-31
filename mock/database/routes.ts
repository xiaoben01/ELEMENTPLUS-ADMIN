/*
 * @Description: 动态路由
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
export default [
  {
    id: 1000,
    parentId: 0,
    sort: 1,
    path: '/404',
    component: '#',
    title: '404',
    icon: 'Bell',
    alwaysShow: 1,
    hidden: 0,
    noCache: 0,
    breadcrumb: 1,
    affix: 0,
    noTags: 0,
    open: 0,
    activeMenu: '',
    isShow: 1
  },
  {
    id: 1001,
    parentId: 1000,
    sort: 1,
    path: '/404',
    component: 'public/404',
    title: '404',
    alwaysShow: 0,
    hidden: 0,
    noCache: 0,
    breadcrumb: 1,
    affix: 0,
    noTags: 0,
    open: 0,
    activeMenu: '',
    isShow: 1
  },
  {
    id: 2000,
    parentId: 0,
    sort: 2,
    path: '/pugin',
    component: '#',
    name: 'Pugin',
    title: '插件',
    icon: 'Menu',
    activeMenu: '',
    affix: 0,
    alwaysShow: 1,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '/pugin/pugin1',
    isShow: 1
  },
  {
    id: 2001,
    parentId: 2000,
    sort: 1,
    path: 'pugin1',
    component: 'pugin/pugin1',
    name: 'PuginPugin1',
    title: '图片上传',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2002,
    parentId: 2000,
    sort: 2,
    path: 'pugin2',
    component: 'pugin/pugin2',
    name: 'PuginPugin2',
    title: '编辑器',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2003,
    parentId: 2000,
    sort: 3,
    path: 'pugin3',
    component: 'pugin/pugin3',
    name: 'PuginPugin3',
    title: '分页',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2004,
    parentId: 2000,
    sort: 4,
    path: 'pugin4',
    component: 'pugin/pugin4',
    name: 'PuginPugin4',
    title: '图标选择器',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2005,
    parentId: 2000,
    sort: 5,
    path: 'pugin5',
    component: 'pugin/pugin5',
    name: 'PuginPugin5',
    title: '二维码生成器',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2006,
    parentId: 2000,
    sort: 6,
    path: 'pugin6',
    component: 'pugin/pugin6',
    name: 'PuginPugin6',
    title: 'echart图表',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2007,
    parentId: 2000,
    sort: 7,
    path: 'pugin7',
    component: 'pugin/pugin7',
    name: 'PuginPugin7',
    title: '批量生成二维码并下载',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2008,
    parentId: 2000,
    sort: 8,
    path: 'pugin8',
    component: 'pugin/pugin8',
    name: 'PuginPugin8',
    title: 'SKU生成器',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  },
  {
    id: 2009,
    parentId: 2000,
    sort: 9,
    path: 'pugin9',
    component: 'pugin/pugin9',
    name: 'PuginPugin9',
    title: 'SKU选择器',
    icon: '',
    activeMenu: '',
    affix: 0,
    alwaysShow: 0,
    breadcrumb: 1,
    hidden: 0,
    noCache: 0,
    noTags: 0,
    open: 0,
    redirect: '',
    isShow: 1
  }
];
