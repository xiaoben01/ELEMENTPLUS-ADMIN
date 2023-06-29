/*
 * @Description: pinia状态管理
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import modules from './modules';

const useStore = (): any => ({
  ...modules
});

export default useStore;
