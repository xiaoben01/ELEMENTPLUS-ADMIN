<!--
 * @Description: 批量生成二维码
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <vue-qr style="display: none" :text="form.url" :size="200" />
        <el-form ref="ruleFormRef" :rules="rules" :model="form" label-width="120px" :size="formSize">
          <el-form-item label="二维码链接" prop="url">
            <el-input v-model="form.url" />
          </el-form-item>
          <el-form-item label="生成数量" prop="number">
            <el-input-number v-model="form.number" :min="0" :max="50000" controls-position="right" />
          </el-form-item>
          <el-form-item label="起始序号" prop="serialNumber">
            <el-input-number v-model="form.serialNumber" :min="1" controls-position="right" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :size="formSize" @click="onSubmit(ruleFormRef)">生成并下载</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import JSZip from 'jszip';
import { computed, reactive, ref } from 'vue';
// 引入状态管理
import useStore from '@/store';
import { ElLoading, FormInstance, FormRules } from 'element-plus';
// 状态管理
const { settings } = useStore();
// 获取formSize状态
const formSize = computed(() => settings().formSize);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  url: [{ required: true, message: '请输入二维码链接', trigger: 'blur' }],
  number: [
    // 生成数量必须大于0
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('生成数量必须大于0'));
        } else {
          callback();
        }
      }
    }
  ]
});
interface Form {
  url: string;
  number: number;
  serialNumber: number;
}
// 定义表单数据
const form = reactive<Form>({
  url: '',
  number: 0,
  serialNumber: 1
});
// 提交表单
const onSubmit = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '生成中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 延时0.5秒
      await new Promise((resolve) => setTimeout(resolve, 500));
      loading.close();
      download();
    } else {
      console.log('error submit!', fields);
    }
  });
};
const download = async (): Promise<void> => {
  const loading = ElLoading.service({
    lock: true,
    text: '打包准备中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  const zip = new JSZip();
  const promises: any[] = [];
  // 获取box-card下的img标签
  const elements = document.querySelector('.box-card img');
  const imgElement = elements as HTMLImageElement;
  // 循环插入二维码
  for (let i = 0; i < form.number; i++) {
    // 将二维码添加到zip中
    promises.push(zip.file(`qrcode-${i + form.serialNumber}.png`, imgElement.src.substring(22), { base64: true }));
  }
  // 获取box-card下的所有img标签
  // const elements = document.querySelectorAll('.box-card img');
  // console.log(elements);
  // elements.forEach((element, index) => {
  //   const imgElement = element as HTMLImageElement;
  //   promises.push(zip.file(`qrcode-${index + 1}.png`, imgElement.currentSrc.substring(22), { base64: true }));
  // });
  await Promise.all(promises);
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'qrcodes.zip';
    loading.close();
    link.click();
  });
};
</script>
<style lang="scss" scoped></style>
