/*
 * @Description: 应用主入口
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { createApp } from 'vue';
import App from './App.vue';
import init from './init';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 创建VUE实例
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
init(app).then(async (router) => {
  router.isReady().then(() => app.mount('#app'));
});
