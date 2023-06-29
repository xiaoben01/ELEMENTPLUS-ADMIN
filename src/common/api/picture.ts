/*
 * @Description: 图片Api
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 保存图片
export function saveImg(data: any): Promise<any> {
  return request({
    url: '/file/saveQiniuImg',
    data,
    method: 'post'
  });
}
// 获取图片列表
export function getImglist(data: any): Promise<any> {
  return request({
    url: '/file/getList',
    data,
    method: 'post'
  });
}
// 删除图片
export function delImg(data: any): Promise<any> {
  return request({
    url: '/file/delImg',
    data,
    method: 'post'
  });
}
// 根据id获取图片
export function getImgByIds(data: any): Promise<any> {
  return request({
    url: '/file/getImgByIds',
    data,
    method: 'post'
  });
}
// 获取七牛云路径
export function getQiniuUrl(): Promise<any> {
  return request({
    url: `/common/getQiniuUrl`,
    method: 'post'
  });
}
