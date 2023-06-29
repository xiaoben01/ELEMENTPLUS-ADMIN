<!--
 * @Description: 模型管理
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
              <el-button type="primary" @click="edit(0)">添加菜单</el-button>
            </div>
          </div>
        </template>
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          default-expand-all
        >
          <el-table-column prop="title" label="名称">
            <template #default="scope">
              <span v-if="scope.row.icon" style="margin-right: 5px">
                <el-icon>
                  <component :is="scope.row.icon" />
                </el-icon>
              </span>
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="path"
            label="跳转路径(path)"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="component"
            label="页面路径(component)"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称(name 不可重复)"
          ></el-table-column>
          <el-table-column
            prop="hidden"
            label="是否显示"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-switch
                v-if="scope.row.name != 'Dashboard'"
                v-model="scope.row.hidden"
                @change="changeField(scope.row.id, scope.row.hidden, 'hidden')"
                :active-value="0"
                :inactive-value="1"
                active-color="#13ce66"
                inactive-color="gray"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="redirect"
            label="重定向(redirect 只父级)"
          ></el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="160"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="edit(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="delData(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllData, setColumnValByKey, del } from '@/common/api';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';
import { useRoute } from 'vue-router';
// 类型定义
interface TableData {
  id: number;
  parentId: number;
  icon: string;
  title: string;
  path: string;
  component: string;
  name: string;
  hidden: number;
  redirect: string;
  isdefault: number;
  isAdmin: number;
  sort: number;
}
// 初始化tableData
const tableData = ref<TableData[]>([]);
// 获取路由
const route = useRoute();
// 获取列表
onMounted(async () => {
  getListData();
});
const getListData = async (): Promise<void> => {
  const res = await getAllData('controllers');
  tableData.value = res.data;
};
// 编辑状态
const changeField = async (
  id: number,
  value: number,
  field: string
): Promise<void> => {
  let data = {};
  if (field === 'hidden') {
    data = { hidden: value };
  } else {
    ElMessage({
      message: '参数错误',
      type: 'error'
    });
    return;
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  return new Promise<void>((resolve, reject) => {
    setColumnValByKey(id, data, 'controllers')
      .then((resp) => {
        loading.close();
        if (resp.code === 200) {
          ElMessage({
            message: resp.msg,
            type: 'success'
          });
          //刷新页面
          window.location.reload();
        }
        resolve();
      })
      .catch((error) => {
        ElMessage({
          message: error.msg,
          type: 'success'
        });
        loading.close();
        reject(error);
      });
  });
};
const edit = (id: number): void => {
  router.push({
    path: `/model/edit/${id}`
  });
};
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
        del(id, 'controllers')
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
