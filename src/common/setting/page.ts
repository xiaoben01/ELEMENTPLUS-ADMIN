/*
 * @Description: 页面标题设置
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import setting from './setting';

export const pageTitle = (pageTitle: string): string => {
  if (pageTitle) {
    return `${pageTitle} - ${setting.title}`;
  }
  return `${setting.title}`;
};
