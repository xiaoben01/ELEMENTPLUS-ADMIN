<!--
 * @Description: SkuForm插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <SkuForm ref="skuForm" :source-attribute="sourceAttribute" :structure="structure" :submit-list="sumitList" @select-sku="selectSku" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
/**********  引入  **********/
import { ref } from 'vue';
/**********  变量  **********/
const sourceAttribute = ref([]);
const sumitList = ref([]);
const sku = ref<any>([]);
const structure = [
  {
    key: 'score',
    type: 'input',
    label: '积分',
    precision: 0
  },
  {
    key: 'price',
    type: 'input',
    label: '价格',
    precision: 2
  },
  {
    key: 'stock',
    type: 'input',
    label: '库存',
    precision: 0
  }
];
/**********  方法  **********/
const selectSku = (data: any): void => {
  sku.value = data;
  console.log(sku.value[0].value);
};
</script>

<style lang="scss" scoped></style>
