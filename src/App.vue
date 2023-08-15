<!--
 * @Description: 应用主模板
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <router-view v-if="isRouterAlive" />
</template>

<script setup lang="ts">
import { ref, computed, provide, nextTick, onMounted } from 'vue';
import useStore from '@/store';
import { addClass } from '@/common/utils';
// 状态管理
const { settings } = useStore();

// 获取主题
const appTheme = computed(() => settings().theme);

// 刷新页面
const isRouterAlive = ref<boolean>(true);
const onRefresh = (): void => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

// 父组件使用provide，子组件接收：inject('reload')
provide('reload', onRefresh);

onMounted(() => {
  // 获取当前主题
  addClass(document.getElementsByTagName('html')[0], appTheme.value);
});
</script>

<style lang="scss"></style>
