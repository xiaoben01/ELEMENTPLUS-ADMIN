<!--
 * @Description: 视图主体
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition appear name="page-slide" mode="out-in">
        <keep-alive :include="cachedTags">
          <component :is="Component" v-show="isShow" />
        </keep-alive>
      </transition>
      <router-view></router-view>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useStore from '@/store';

// 路由
const router = useRouter();

// 状态
const { tags } = useStore();

// tags
const cachedTags = computed(() => tags().cachedTags);
// 获取路由
const route = useRoute();
// 是否隐藏父页面
const isShow = computed(() => route.meta.isShow);
// 设置router-view key
const key = computed(() => router.currentRoute.value.fullPath + Math.random());
</script>
