<!--
 * @Description: 分页插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="id" />
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
        <Pagination
          :total="total"
          v-model:page="page"
          v-model:size="limit"
          @pagination="getListData"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getList } from '@/common/api';
import Pagination from '@/components/pagination/index.vue';
// 类型定义
interface TableData {
  id: number;
  date: string;
  name: number;
  address: string;
}
// 初始化tableData
const tableData = ref<TableData[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(15);
// 获取列表
onMounted(async () => {
  getListData();
});
const getListData = async (): Promise<any> => {
  const res = await getList({ page: page.value, limit: limit.value }, 'table');
  tableData.value = res.data;
  total.value = res.total;
};
</script>

<style lang="scss" scoped></style>
