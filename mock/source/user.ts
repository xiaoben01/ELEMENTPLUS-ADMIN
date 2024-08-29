/*
 * @Description: 所有API接口
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { MockMethod } from 'vite-plugin-mock';
import userData from '../database/user';
const { users, tokens, routes, picture, table }: any = userData;
let pictureList = picture;
export default [
  {
    url: '/admin-api/dologin',
    method: 'post',
    response: (config: any) => {
      const { username }: any = config.body;
      const token = tokens[username];
      if (!token) {
        return {
          code: 0,
          status: 'error',
          msg: '登录失败！',
          data: null
        };
      }
      return {
        code: 200,
        status: 'success',
        msg: '登录成功！',
        data: token.token
      };
    }
  },
  {
    url: '/admin-api/common/getAdminInfo',
    method: 'get',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '获取用户信息失败！',
          data: null
        };
      }
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        data: info
      };
    }
  },
  {
    url: '/admin-api/role/getAllControllers',
    method: 'get',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '获取菜单数据失败！',
          data: null
        };
      }
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        data: routes
      };
    }
  },
  {
    url: '/admin-api/file/getList',
    method: 'get',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '获取图片数据失败！',
          data: null
        };
      }
      const { page, pageSize } = config.query;
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        // 分页
        data: {
          list: pictureList.slice((page - 1) * pageSize, page * pageSize),
          total: pictureList.length
        }
      };
    }
  },
  {
    url: `/admin-api/file/getImgByIds/:id`,
    method: 'get',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '获取图片数据失败！',
          data: null
        };
      }
      const ids = config.query.id.split(',').map((id: string) => parseInt(id.trim()));
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        data: pictureList.filter((item: any) => ids.includes(item.id))
      };
    }
  },
  {
    url: '/admin-api/file/delImg',
    method: 'post',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '删除图片数据失败！',
          data: null
        };
      }
      const { ids } = config.body;
      pictureList = pictureList.filter((item: any) => !ids.includes(item.id));
      return {
        code: 200,
        status: 'success',
        msg: '删除成功！'
      };
    }
  },
  {
    url: '/admin-api/file/upload',
    method: 'post',
    response: (config: any) => {
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        // 向picture中添加新的图片数据
        data: pictureList.push({
          id: pictureList.length + 1,
          path: 'https://img04.sogoucdn.com/app/a/100520093/f9d5c084396d06f6-0c7006bf1d0bb8d5-b2ff8a084a589cad3e8d8f0426f026cd.jpg'
        })
      };
    }
  },
  {
    url: '/admin-api/file/getQiniuToken',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: 'qiniutoken',
        msg: '获取成功！'
      };
    }
  },
  {
    url: '/admin-api/common/getList/table',
    method: 'get',
    response: (config: any) => {
      const token = config.headers['x-token'];
      const info = users[token];
      if (!info) {
        return {
          code: 0,
          status: 'info',
          msg: '获取table数据失败！',
          data: null
        };
      }
      const { page, pageSize } = config.query;
      return {
        code: 200,
        status: 'success',
        msg: '获取成功！',
        // 分页
        data: {
          list: table.slice((page - 1) * pageSize, page * pageSize),
          total: table.length
        }
      };
    }
  },
  {
    url: '/admin-api/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        status: 'success',
        msg: '退出成功！',
        data: null
      };
    }
  }
] as MockMethod[];
