<!--
 * @Description: 图片插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="120px"
          :size="size"
        >
          <el-form-item label="单图片">
            <div class="image-select">
              <el-image
                v-show="form.shareImgPath"
                :src="form.shareImgPath"
              ></el-image>
            </div>
            <el-button type="text" @click="centerDialogVisible = true">
              选择图片
            </el-button>
            <el-dialog
              v-model="centerDialogVisible"
              width="50%"
              title="选择图片"
              :modal="false"
            >
              <uploadImg
                :limit="1"
                name="shareImg"
                paths="shareImgPath"
                @selected-img="selectedImg"
              />
            </el-dialog>
          </el-form-item>
          <el-form-item label="多图片">
            <div class="ele-flex">
              <div
                class="image-select"
                v-for="item in form.shareImgPath1"
                :key="item.id"
              >
                <el-image :src="item.path"></el-image>
                <el-icon
                  class="checkedImg"
                  @click="delImgIng(item.id, 'shareImg1', 'shareImgPath1')"
                >
                  <Delete />
                </el-icon>
              </div>
            </div>
            <el-button type="text" @click="centerDialogVisible1 = true">
              选择图片
            </el-button>
            <el-dialog
              v-model="centerDialogVisible1"
              width="50%"
              title="选择图片"
              :modal="false"
            >
              <uploadImg
                :limit="3"
                name="shareImg1"
                paths="shareImgPath1"
                @selected-img="selectedImg"
              />
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, ref } from 'vue';
// 引入状态管理
import useStore from '@/store';
import uploadImg from '@/components/upload/img.vue';
// 状态管理
const { settings } = useStore();

const centerDialogVisible = ref(false);
const centerDialogVisible1 = ref(false);
// 获取formSize状态
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
// 定义表单数据
const form = reactive<Form>({
  shareImg: 0,
  shareImgPath: '',
  shareImg1: '',
  shareImgPath1: []
});
const selectedImg = (
  data: any,
  name: keyof Form,
  paths: keyof Form,
  type: boolean
): void => {
  if (type) {
    (form as any)[name] = data[0].id;
    (form as any)[paths] = data[0].path;
  } else {
    (form as any)[name] = data.map((item: any) => item.id).toString();
    (form as any)[paths] = data;
  }
  centerDialogVisible.value = false;
  centerDialogVisible1.value = false;
};
const delImgIng = (id: string | number, name: string, paths: string): void => {
  const i = (form as any)[name].split(',').indexOf(id.toString());
  (form as any)[name] = (form as any)[name].split(',');
  (form as any)[name].splice(i, 1);
  (form as any)[name] = (form as any)[name].toString();
  (form as any)[paths].splice(i, 1);
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item__content) {
  /* Your styles here */
  display: block;
}
.ele-flex {
  display: flex;
}
.image-select {
  margin: 2px 5px 2px 0;
  position: relative;
}
.el-image {
  width: 150px;
  height: 150px;
}
.checkedImg {
  position: absolute;
  right: 1px;
  top: 1px;
  font-size: 18px;
  color: #ffffff;
  background: rgba(231, 1, 40, 0.815);
  opacity: 0.7;
  height: 25px;
  width: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 2px;
}
.op0 {
  opacity: 1;
}
</style>
