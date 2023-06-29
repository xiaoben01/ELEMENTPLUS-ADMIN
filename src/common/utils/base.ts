/*
 * @Description: 常用函数
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
/**
 * @description: 判断是否为外部地址
 * @param {string} path 路径
 * @return {*}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @description: 检查class名称是否存在
 * @param {HTMLElement} ele
 * @param {string} cls
 * @return {*}
 */
export function hasClass(ele: HTMLElement, cls: string): boolean {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * @description: 添加样式
 * @param {HTMLElement} ele
 * @param {string} cls
 * @return {*}
 */
export function addClass(ele: HTMLElement, cls: string): void {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls;
  }
}

/**
 * @description: 删除样式
 * @param {HTMLElement} ele
 * @param {string} cls
 * @return {*}
 */
export function removeClass(ele: HTMLElement, cls: string): void {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * @description: 删除（添加）一个类
 * @param {HTMLElement} ele
 * @param {string} cls
 * @return {*}
 */
export function toggleClass(ele: HTMLElement, cls: string): void {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}
