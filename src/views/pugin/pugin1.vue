<!--
 * @Description: 图片插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-form ref="ruleFormRef" :model="form" label-width="120px" :size="size">
          <el-form-item label="单图片">
            <album :limit="1" name="shareImg" paths="shareImgPath" :path-val="form.shareImgPath" @del-img="delImgIng" @open-img="openImgDia" />
          </el-form-item>
          <el-form-item label="多图片">
            <album :limit="3" name="shareImg1" paths="shareImgPath1" :path-val="form.shareImgPath1" @del-img="delImgIng" @open-img="openImgDia" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-dialog v-model="centerDialogVisible" width="50%" title="选择图片" :modal="false">
        <uploadImg :limit="imgsDiaForm.limit" :name="imgsDiaForm.name" :paths="imgsDiaForm.path" @selected-img="selectedImg" />
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, ref } from 'vue';
import useStore from '@/store';
const { settings } = useStore();
const centerDialogVisible = ref(false);
const size = computed(() => settings().formSize);
interface Image {
  id: number;
  path: string;
}
interface Form {
  shareImg: number;
  shareImgPath: string;
  shareImg1: string;
  shareImgPath1: Image[];
}
interface UploadImgItem {
  name: string;
  path: string;
  limit: number;
}
const form = reactive<Form>({
  shareImg: 0,
  shareImgPath: '',
  shareImg1: '',
  shareImgPath1: []
});
const imgsDiaForm = ref<UploadImgItem>({
  name: '',
  path: '',
  limit: 0
});
const selectedImg = (data: any, name: string, paths: string, type: boolean): void => {
  if (type) {
    (form as any)[name] = data[0].id;
    (form as any)[paths] = data[0].path;
  } else {
    (form as any)[name] = data.map((item: any) => item.id).toString();
    (form as any)[paths] = data;
  }
  centerDialogVisible.value = false;
};
const delImgIng = (id: number, name: string, paths: string, limit: number): void => {
  if (limit > 1) {
    const i = (form as any)[name].split(',').indexOf(id.toString());
    (form as any)[name] = (form as any)[name].split(',');
    (form as any)[name].splice(i, 1);
    (form as any)[name] = (form as any)[name].toString();
    (form as any)[paths].splice(i, 1);
  } else {
    (form as any)[name] = 0;
    (form as any)[paths] = '';
  }
};
const openImgDia = (data: any, type: boolean): void => {
  imgsDiaForm.value = data;
  centerDialogVisible.value = type;
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item__content) {
  /* Your styles here */
  display: block;
}
</style>
