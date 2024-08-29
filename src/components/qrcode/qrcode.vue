<!--
 * @Description: 生成二维码二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div>
    <vue-qr qid="qrid1" :callback="qrBack" :correct-level="2" :text="props.qrText" :size="props.sizeValue" :color-dark="props.colorValue" :logo-src="logoSrc"></vue-qr>
    <div>
      <el-button @click="downQr" class="elementPlus-admin-mt-10 elementPlus-admin-full-flex">下载生成的二维码图片</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import { ref } from 'vue';
// 定义props
const props = defineProps({
  //二维码的内容，如用户输入的链接等
  qrText: {
    type: String,
    default: null
  },
  // 二维码的标题，用于下载时的文件名
  title: {
    type: String,
    default: null
  },
  //二维码的默认颜色值，此处用黑色
  colorValue: {
    type: String,
    default: '#000000'
  },
  //logo的src
  logoSrc: {
    type: String,
    default: null
  },
  //二维码的默认大小
  sizeValue: {
    type: Number,
    default: 400
  }
});
//下载二维码图片
const downQr = (): void => {
  // let name = new Date().getTime();
  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = props.title + '.png';
  a.href = qrData.value;
  document.body.appendChild(a);
  a.click();
};
//二维码图片的编码数据
const qrData = ref('');
//qr的回调，每次变动后把二维码的数据保存下来，供下载用
const qrBack = (dataUrl: any): void => {
  qrData.value = dataUrl;
};
</script>
<style scoped lang="scss"></style>
