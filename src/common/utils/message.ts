/*
 * @Description: Element 二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { ElMessageBox } from 'element-plus';
import type { ElMessageBoxOptions } from 'element-plus';

/**
 * @description: 确认消息
 * @param {any} message 确认文字
 * @param {any} options 参数
 * @param {any} callback 回调
 * @return {*}
 */
export const $confirm = (message: any, options?: any, callback?: any): any => {
  const mesType = typeof message === 'object';
  const optType = typeof options === 'function';
  const params: ElMessageBoxOptions = {
    message: mesType ? '' : message,
    title: '提示',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  };
  // 合并参数
  Object.assign(params, mesType ? message : options);
  // ElMessageBox
  ElMessageBox.confirm(params.message, params.title, {
    confirmButtonText: params.confirmButtonText,
    cancelButtonText: params.cancelButtonText,
    type: params.type
  })
    .then(() => {
      optType ? options() : callback();
    })
    .catch((err) => console.log(err));
};
