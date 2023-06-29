<!--
 * @Description: 菜单链接组件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <component :is="linkType" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isExternal } from '@/common/utils';

// props
const props = defineProps({
  // 链接地址
  to: {
    type: String,
    required: true
  }
});

/**
 * @description: 判断链接类型：外部使用 a 标签, 内部使用 router-link
 * @return {*}
 */
const linkType = computed(() => {
  if (isExternal(props.to)) {
    return 'a';
  }
  return 'router-link';
});

/**
 * @description: 链接属性
 * @param {*} to 链接地址
 * @return {*}
 */
const linkProps = (to: string): any => {
  if (isExternal(props.to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    };
  }
  return {
    to: to
  };
};
</script>
