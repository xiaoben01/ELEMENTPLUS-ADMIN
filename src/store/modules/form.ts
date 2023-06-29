/*
 * @Description: 表单状态管理
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { defineStore } from 'pinia';
import type { FormState, FormLabelType } from '@/types/store';

const useStore = defineStore({
  id: 'form',

  // 基本状态数据
  state: (): FormState => ({
    labelPosition: 'right'
  }),

  // 从基本数据(state)派生的数据
  getters: {},

  // 提交更新数据的方法(异步)
  actions: {
    // 设置表单label位置
    setFormLabel(value: FormLabelType): void {
      this.labelPosition = value;
    }
  }
});

export default useStore;
