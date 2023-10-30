<!--
 * @Description: SkuForm插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <CheckboxSkuForm
          ref="skuForm"
          :source-attribute="sourceAttribute"
          :matter-codes-list="matterCodesList"
          :option="[option]"
          :structure="structure"
          :submit-list="sumitList"
          @select-sku="selectSku"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
/**********  引入  **********/
import { onMounted, ref } from 'vue';
/**********  类型  **********/
interface Matter {
  code: string;
  id: number;
  title: string;
}
/**********  变量  **********/
const sourceAttribute = ref<any>([]);
const sumitList = ref([]);
const sku = ref<any>([]);
const option = ref<any>([]);
const structure = [
  {
    key: 'matterCodes',
    type: 'select',
    label: '物料'
  },
  {
    key: 'price',
    type: 'input',
    label: '价格'
  }
];
onMounted(async () => {
  delay(500);
});
// 定义物料列表
const matterCodesList = ref<Matter[]>([
  {
    code: 'CoffeMatter11',
    id: 8,
    title: '咖啡豆'
  },
  {
    code: 'CoffeMatter10',
    id: 7,
    title: '牛奶'
  },
  {
    code: 'CoffeMatter6',
    id: 6,
    title: '白砂糖'
  }
]);

// 延时1.5秒
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      sourceAttribute.value = [
        {
          id: 1,
          name: '温度',
          children: [
            {
              id: 1,
              name: '冰'
            },
            {
              id: 2,
              name: '正常'
            }
          ]
        }
      ];
      resolve();
    }, ms);
  });
};
// 监听sku变化
const selectSku = (data: any): void => {
  sku.value = data;
};
</script>

<style lang="scss" scoped></style>
