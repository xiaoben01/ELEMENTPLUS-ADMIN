<!--
 * @Description: 二维码插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-button type="primary" link @click="qrCode('111111', '二维码下载名称')">二维码</el-button>
      </el-card>
      <!--  二维码相关  -->
      <el-dialog v-model="dialogTableVisible" :close-on-click-modal="false" :before-close="handleClose" title="二维码" width="300px">
        <QrcodeImg :qr-text="codeData.url" :size="200" :title="codeData.title" />
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElLoading } from 'element-plus';
// 弹窗状态
const dialogTableVisible = ref(false);
// 二维码地址
const codeData = ref({
  url: '',
  title: ''
});
// 获取二维码
const qrCode = async (url: string, title: string): Promise<void> => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  codeData.value = {
    url: url,
    title: title
  };
  // 弹窗开启
  dialogTableVisible.value = true;
  loading.close();
};
// 关闭弹窗
const handleClose = (done: any): void => {
  dialogTableVisible.value = false;
  done();
};
</script>

<style lang="scss" scoped></style>
