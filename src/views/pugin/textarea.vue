<!--
 * @Description: 编辑器
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-form ref="ruleFormRef" :model="form" label-width="120px" :size="size">
          <el-form-item label="编辑器">
            <Tinymce ref="content" v-model="form.content" name="content" @get-content="getContent" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
// 引入状态管理
import useStore from '@/store';
import Tinymce from '@/components/tinymce/index.vue';
// 状态管理
const { settings } = useStore();

// 获取formSize状态
const size = computed(() => settings().formSize);

interface Form {
  content: string;
}
const getContent = (v: string): void => {
  form.content = v;
};
// 定义表单数据
const form = reactive<Form>({
  content: ''
});
</script>
<style lang="scss" scoped></style>
