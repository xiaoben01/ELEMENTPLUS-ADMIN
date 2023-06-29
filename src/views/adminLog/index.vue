<!--
 * @Description: 日志管理
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column label="序号" align="center" width="80">
            <template #default="scope">
              {{ scope.$index + (page - 1) * limit + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="adminName"
            label="管理员名称"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <span v-if="scope.row.type == 1">新增了</span>
              <span v-else-if="scope.row.type == 2">编辑了</span>
              <span v-else-if="scope.row.type == 3">删除了</span>
              <span v-else-if="scope.row.type == 0">登录</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="desc"
            label="描述"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="changeId"
            label="id为"
            align="center"
          ></el-table-column>
          <el-table-column prop="created_at" label="操作时间" align="center">
            <template #default="scope">
              {{ formatTime(scope.row.created_at) }}
            </template>
          </el-table-column>
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
import { formatTime } from '@/common/utils';
import Pagination from '@/components/pagination/index.vue';
// 类型定义
interface TableData {
  id: number;
  adminName: string;
  type: number;
  desc: string;
  changeId: string;
  created_at: number;
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
  const res = await getList(
    { page: page.value, limit: limit.value },
    'admin_log'
  );
  tableData.value = res.data;
  total.value = res.total;
};
</script>

<style lang="scss" scoped></style>
