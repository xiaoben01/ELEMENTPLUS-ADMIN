/*
 * @Description: 用户状态管理
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { defineStore } from 'pinia';
import type { UserState } from '@/types/store';
import setting from '@/common/setting';
import { storage } from '@/common/utils';
import { resetRouter } from '@/router';
import tags from './tags';
import service from '@/common/request/http';

const useStore = defineStore({
  id: 'user',

  // 基本状态数据
  state: (): UserState => ({
    token: storage.get(setting.tokenName, 'session') || null,
    info: null,
    roles: []
  }),

  // 从基本数据(state)派生的数据
  getters: {},

  // 提交更新数据的方法(异步)
  actions: {
    async setReset() {
      this.$reset();
    },

    // 设置token
    setToken(value: any): void {
      this.token = value;
      storage.set(setting.tokenName, value, 'session');
    },

    // 设置用户信息
    setInfo(value: any): void {
      this.info = value;
    },

    // 设置用户角色信息
    setRoles(value: string[]): void {
      this.roles = value;
    },

    // 登录
    login(value: any) {
      return new Promise((resolve, reject) => {
        service
          .post(`/dologin`, value)
          .then((res: any) => {
            this.setToken(res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        service
          .get(`common/getAdminInfo`)
          .then(async (res: any) => {
            const data = res.data;
            this.setInfo(data);
            this.setRoles(data.roles);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 注销
    logout() {
      storage.remove(setting.tokenName, 'session');
      this.setReset();
      this.setInfo(null);
      this.setRoles([]);
      resetRouter();
      tags().delAllTags();
    },

    // 清除 Token
    resetToken() {
      return new Promise((resolve) => {
        storage.remove(setting.tokenName, 'session');
        this.setRoles([]);
        this.setReset();
        resolve(null);
      });
    }
  }
});

export default useStore;
