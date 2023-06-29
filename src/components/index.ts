/*
 * @Description: 注册组件
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { App, defineAsyncComponent } from 'vue';

// 自动引入组件
const modules = import.meta.glob('./global/**/*.vue');

// 注册组件
export default function loadComponent(app: App<Element>): void {
  for (const path in modules) {
    const result = path.match(/.*\/(.+).vue$/);
    if (result) {
      const name = result[1];
      const component = modules[path];
      app.component(name, defineAsyncComponent(component as any));
    }
  }
}
