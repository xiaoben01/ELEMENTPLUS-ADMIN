/*
 * @Description: 权限管理API
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 修改密码
export function setPassword(data: any): Promise<any> {
  return request({
    url: `/role/setPassword`,
    method: 'post',
    data: data
  });
}
