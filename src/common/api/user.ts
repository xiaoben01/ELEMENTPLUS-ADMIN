/*
 * @Description: 用户管理API
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 登录
export function login(data?: any): Promise<any> {
  return request({
    url: `/dologin`,
    method: 'post',
    data
  });
}

// 获取用户信息
export function getInfo(params?: any): Promise<any> {
  return request({
    url: `/common/getAdminInfo`,
    method: 'get',
    params
  });
}

// 获取菜单列表(路由数据)
export function getRoutes(params?: any): Promise<any> {
  return request({
    url: `/role/getAllControllers`,
    method: 'get',
    params
  });
}

// 退出
export function logout(): Promise<any> {
  return request({
    url: `/logout`,
    method: 'post'
  });
}
