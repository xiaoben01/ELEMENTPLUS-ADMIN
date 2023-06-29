/*
 * @Description: 左侧菜单栏API
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 退出
export function getMenuAll(): Promise<any> {
  return request({
    url: `/controllers/getMenuAll`,
    method: 'post'
  });
}
