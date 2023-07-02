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
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px auto !important;
}

.iconselect-container {
  position: relative;
  width: 400px;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-top: 10px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    width: 10%;
    padding: 5px;
    margin: 0 10px 10px 0;
    cursor: pointer;
    border: 1px solid #ccc;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transition: all 0.2s;
      transform: scaleX(1.1);
    }
  }
}
</style>
