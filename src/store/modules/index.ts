/*
 * @Description: 模块（作用域）状态管理
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
// import 自动导入
const modulesFiles = import.meta.glob('./*.ts', {
  import: 'default',
  eager: true
});

const modules = Object.keys(modulesFiles).reduce(
  (modules: { [key: string]: any }, path: string) => {
    const moduleName = path.replace(/^\.\/(.*)\.\w+$/, '$1');
    modules[moduleName] = modulesFiles[path];
    return modules;
  },
  {}
);

export default modules;
