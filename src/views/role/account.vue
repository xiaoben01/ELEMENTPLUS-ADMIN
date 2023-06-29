<!--
 * @Description: 账号管理
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div></div>
            <div>
              <el-button type="primary" @click="editData(0)">
                添加账号
              </el-button>
            </div>
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column label="序号" align="center" width="80">
            <template #default="scope">
              {{ scope.$index + (page - 1) * limit + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="账号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色"
            align="center"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="editData(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="delData(scope.row.id)"
                v-if="scope.row.id !== 1"
              >
                删除
              </el-button>
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
import { getList, del } from '@/common/api';
import Pagination from '@/components/pagination/index.vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';
import { useRoute } from 'vue-router';
// 获取路由
const route = useRoute();
// 类型定义
interface TableData {
  id: number;
  username: string;
  roleName: number;
}
// 初始化tableData
const tableData = ref<TableData[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(15);
// 生命周期钩子函数
onMounted(async () => {
  getListData();
});
// 获取列表数据
const getListData = async (): Promise<any> => {
  const res = await getList({ page: page.value, limit: limit.value }, 'admin');
  tableData.value = res.data;
  total.value = res.total;
};
// 编辑数据
const editData = (id: number): void => {
  router.push({
    path: id === 0 ? `/role/accountAdd/${id}` : `/role/accountEdit/${id}`
  });
};
// 删除数据
const delData = (id: number): void => {
  ElMessageBox.confirm('确定删除吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise<void>((resolve, reject) => {
        del(id, 'admin')
          .then((resp) => {
            loading.close();
            if (resp.code === 200) {
              ElMessage({
                message: resp.msg,
                type: 'success'
              });
              //重载页面
              router.replace({ path: '/redirect' + route.fullPath });
            }
            resolve();
          })
          .catch((error) => {
            loading.close();
            reject(error);
          });
      });
    })
    .catch(() => {
      console.log('取消删除');
    });
};
</script>

<style lang="scss" scoped></style>
