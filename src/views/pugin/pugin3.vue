<!--
 * @Description: 分页插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="id" />
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
        <Pagination :total="listQuery.total" v-model:page="listQuery.page" v-model:size="listQuery.limit" @pagination="getListData" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getList } from '@/common/api';
import router from '@/router';
// 类型定义
interface TableData {
  id: number;
  date: string;
  name: number;
  address: string;
}
// 初始化tableData
const tableData = ref<TableData[]>([]);
// 初始化listQuery
const listQuery = reactive({
  total: 0,
  page: 1,
  limit: 15
});
// 获取列表
onMounted(async () => {
  // 判断当前路由是否是当前页面
  if (router.currentRoute.value.name === 'PuginPugin3') {
    getListData();
  }
});
const getListData = async (): Promise<any> => {
  console.log(listQuery);
  const res = await getList(listQuery, 'table');
  tableData.value = res.data;
  listQuery.total = res.total;
};
</script>

<style lang="scss" scoped></style>
