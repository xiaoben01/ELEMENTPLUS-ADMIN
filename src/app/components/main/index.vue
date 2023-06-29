<!--
 * @Description: 视图主体
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition appear name="page-slide" mode="out-in">
        <keep-alive :include="cachedTags">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useStore from '@/store';

// 路由
const router = useRouter();

// 状态
const { tags } = useStore();

// tags
const cachedTags = computed(() => tags().cachedTags);

// 设置router-view key
const key = computed(() => router.currentRoute.value.fullPath + Math.random());
</script>
