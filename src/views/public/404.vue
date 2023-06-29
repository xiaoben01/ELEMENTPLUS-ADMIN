<!--
 * @Description: 404
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div
    class="vus-pa-50 vus-h-100 app-flex app-flex-items-center app-flex-justify-center column"
  >
    <div class="vus-fs-100 vus-fw-700">404</div>
    <div class="vus-fs-18">出错啦！你访问的页面不存在~~~</div>
    <div class="vus-pt-15">
      <el-button @click="handleBack">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const handleBack = (): void => {
  router.push({
    path: '/'
  });
};
</script>
