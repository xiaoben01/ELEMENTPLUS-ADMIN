/*
 * @Description: 七牛云Api
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 获取七牛云token
export function getToken(): Promise<any> {
  return request({
    url: '/file/getQiniuToken', // 假地址 自行替换
    method: 'post'
  });
}
