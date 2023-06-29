/*
 * @Description: 权限指令
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
import useStore from '@/store';
import { Directive, DirectiveBinding } from 'vue';

/**
 * @description: 角色权限校验(v-role="['admin', 'demo']")
 * @return {*}
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    if (value) {
      // DOM绑定需要的角色编码
      const requiredRoles = value;
      const { user } = useStore();
      const hasRole = user().roles.some((perm: any) => {
        return requiredRoles.includes(perm);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      return false;
    }
  }
};
