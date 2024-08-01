/*
 * @Description: 公共方法API
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import request from '@/common/request/http';

// 获取列表数据
export function getList(data: any, dbname: string): Promise<any> {
  return request({
    url: `/common/getList/${dbname}`,
    method: 'post',
    data: data
  });
}

// 获取一条数据
export function getOneDataById(id: number, dbname: string): Promise<any> {
  return request({
    url: `/common/getOneDataById`,
    method: 'post',
    data: { id: id, dbname: dbname }
  });
}

// 更新
export function update(id: number, data: any, dbname: string): Promise<any> {
  return request({
    url: `/common/update/${id}/${dbname}`,
    method: 'post',
    data: data
  });
}

// 获取所有数据
export function getAllData(dbname: string): Promise<any> {
  return request({
    url: `/common/getAllData`,
    method: 'post',
    data: { name: dbname }
  });
}

// 根据某列获取所有数据
export function getAllDataByColumn(column: string, val: string | number, dbname: string): Promise<any> {
  return request({
    url: `/common/getAllDataByColumn/${column}/${val}/${dbname}`,
    method: 'post'
  });
}

// 删除数据
export function del(ids: number | string, dbname: string): Promise<any> {
  return request({
    url: `/common/del/${dbname}`,
    method: 'post',
    data: { ids: ids }
  });
}

// 设置某列的值
export function setColumnValByKey(id: number, data: any, dbname: string): Promise<any> {
  return request({
    url: `/common/setColumnValByKey/${id}/${dbname}`,
    method: 'post',
    data: data
  });
}

//根据ID获取地址名
export function getAddressNameByIds(ids: any): Promise<any> {
  return request({
    url: `/common/getAddressNameByIds`,
    method: 'post',
    data: { ids: ids }
  });
}
