<!--
 * @Description: 分页插件
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div class="elementPlus-admin-div-flex"></div>
            <div>
              <el-button class="filter-item" type="primary" @click="exportUser">导出</el-button>
            </div>
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="id" />
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
        <Pagination :total="listQuery.total" v-model:page="listQuery.page" v-model:size="listQuery.pageSize" @pagination="getListData" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import router from '@/router';
import service from '@/common/request/http';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
// 类型定义
interface TableData {
  id: number;
  date: string;
  name: number;
  address: string;
}
// 初始化tableData
const tableData = ref<TableData[]>([]);
const multipleSelectedRows = ref<TableData[]>([]);
// 初始化listQuery
const listQuery = reactive({
  total: 0,
  page: 1,
  pageSize: 15
});
// 获取列表
onMounted(async () => {
  // 判断当前路由是否是当前页面
  if (router.currentRoute.value.name === 'PuginPugin3') {
    getListData();
  }
});
const getListData = async (): Promise<any> => {
  const res = await service.get(`common/getList/table`, {
    params: listQuery
  });
  tableData.value = res.data.list;
  listQuery.total = res.data.total;
};
const exportUser = (): void => {
  if (multipleSelectedRows.value.length === 0) {
    ElMessage({
      type: 'error',
      message: '请选择需要导出数据!'
    });
    return;
  }
  const head = [['ID', 'Date', 'Name', 'Address']];
  multipleSelectedRows.value.map((item: any) => {
    if (item.isSpec === 1) {
      let rowData: any[] = [];
      rowData = [item.id, item.date, item.name, item.address];
      head.push(rowData);
    }
  });
  const data = XLSX.utils.aoa_to_sheet(head);
  const wb = XLSX.utils.book_new();
  const wscols = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 50 }, { wch: 15 }, { wch: 15 }];
  data['!cols'] = wscols;
  XLSX.utils.book_append_sheet(wb, data, 'sheet');
  XLSX.utils.book_append_sheet(wb, data, 'data');
  XLSX.writeFile(wb, '导出.xlsx');
};
const handleSelectionChange = (val: any): void => {
  multipleSelectedRows.value = val;
};
</script>

<style lang="scss" scoped></style>
