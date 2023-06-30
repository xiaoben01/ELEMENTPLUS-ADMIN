/*
 * @Description: 用户数据
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import routes from './routes';
import picture from './picture';
import table from './table';
export default {
  // 用户信息
  users: {
    'admin-token': {
      name: 'Admin',
      roleName: '超级管理员',
      roles: ['admin'],
      expires: 180,
      avatar: '/public/logo.png'
    },
    'demo-token': {
      name: 'Demo',
      roleName: '演示组',
      roles: ['demo'],
      expires: 180,
      avatar: '/public/logo.png'
    }
  },
  // token信息
  tokens: {
    admin: {
      token: 'admin-token'
    },
    demo: {
      token: 'demo-token'
    }
  },
  // 动态路由
  routes,
  // 图片数据
  picture,
  // 表格数据
  table
};
