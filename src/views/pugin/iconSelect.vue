<!--
 * @Description: 图标选择器插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <IconSelect v-model="iconName" />
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import IconSelect from '@/components/iconSelect/index.vue';
const iconName = ref('Camera');
</script>
<style lang="scss" scoped></style>
