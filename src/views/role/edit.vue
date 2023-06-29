<!--
 * @Description: 添加/编辑角色
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="vus-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="form"
          label-width="220px"
          width="80%"
          :size="size"
        >
          <el-form-item label="名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="权限">
            <el-tree
              ref="treeRef"
              :data="menuArr"
              show-checkbox
              node-key="id"
              :default-checked-keys="form.checkData"
              :props="defaultProps"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(ruleFormRef)">
              保 存
            </el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
// 引入状态管理
import useStore from '@/store';
import {
  ElLoading,
  ElMessage,
  FormInstance,
  FormRules,
  ElTree
} from 'element-plus';
import { useRoute } from 'vue-router';
import { getAllData, getOneDataById, update } from '@/common/api';
import { closeSelectedTag } from '@/common/utils';
// 定义props
const defaultProps = {
  children: 'children',
  label: 'label'
};
// 定义树形实例对象
const treeRef = ref<InstanceType<typeof ElTree>>();
// 获取路由
const route = useRoute();
// 获取url参数
const id: number = parseInt(route.params.id as string);
// 定义表单数据
const form = reactive({
  title: '',
  description: '',
  controlid: '',
  checkData: []
});
// 状态管理
const { settings } = useStore();
// 获取formSize状态
const size = computed(() => settings().formSize);
// 表单实例对象
const ruleFormRef = ref<FormInstance>();
// 验证规则
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
});
// 初始化数据
const menuArr = reactive([]);
// 获取数据
onMounted(async () => {
  // 获取菜单数据
  const result = await getAllData('controllers');
  Object.assign(menuArr, result.data);
  // 判断是否有id
  if (id && id !== 0) {
    const Info = await getOneDataById(id, 'role');
    Object.assign(form, Info.data);
  }
});

// 关闭tabs页面
const cancel = (): void => {
  closeSelectedTag(route);
};
// 提交表单
const onSubmit = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      const checkData = treeRef.value!.getCheckedKeys(false);
      if (checkData.length === 0) {
        return ElMessage({
          message: '请选择权限',
          type: 'error'
        });
      }
      form.controlid = checkData.join(',');
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise<void>((resolve, reject) => {
        update(id, form, 'role')
          .then((resp) => {
            loading.close();
            if (resp.code === 200) {
              ElMessage({
                message: resp.msg,
                type: 'success'
              });
              //关闭当前页面
              closeSelectedTag(route);
            }
            resolve();
          })
          .catch((error) => {
            loading.close();
            reject(error);
          });
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>

<style lang="scss" scoped></style>
