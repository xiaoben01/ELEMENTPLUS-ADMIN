/*
 * @Description: mock配置入口
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// 自动导入文件, 忽略 database 文件夹所有文件
const modules = import.meta.glob(['./source/*.ts', '!./source/database/*'], {
  import: 'default',
  eager: true
});

const mockModules: any[] = [];
Object.keys(modules).forEach(async (key) => {
  if (key.includes('_')) {
    return;
  }
  mockModules.push(...(modules[key] as any));
});

export function setupProdMockServer(): void {
  createProdMockServer(mockModules);
}
