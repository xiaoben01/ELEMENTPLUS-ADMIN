/*
 * @Description: 网络请求配置
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { storage } from '@/common/utils';
import setting from '@/common/setting';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 6000
});
// 请求拦截处理
service.interceptors.request.use(
  (config: any) => {
    if (setting.request.token && storage.get(setting.tokenName, 'session')) {
      config.headers['X-Token'] = storage.get(setting.tokenName, 'session');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截处理
service.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code !== 200) {
      ElMessage({
        message: data.msg || 'Error',
        type: 'error'
      });
      return Promise.reject(data.msg);
    }
    return data;
  },
  (error) => {
    ElMessage({
      message: error.msg || 'Error',
      type: 'error'
    });
    return Promise.reject(error);
  }
);

export default service;
