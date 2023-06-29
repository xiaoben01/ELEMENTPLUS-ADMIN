<!--
 * @Description: 添加/编辑账号
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
          :size="size"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="id === 0">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
            <el-select v-model="form.role_id" placeholder="请选择角色">
              <el-option
                v-for="item in roleArr"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
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
import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus';
// 引入工具函数的验证方法
import { validatorFunction, closeSelectedTag } from '@/common/utils';
import { useRoute } from 'vue-router';
import { getAllData, getOneDataById, update } from '@/common/api';
// 获取路由
const route = useRoute();
// 获取url参数
const id: number = parseInt(route.params.id as string);
// 定义表单数据
const form = reactive({
  username: '',
  password: '',
  role_id: ''
});
// 状态管理
const { settings } = useStore();
// 获取formSize状态
const size = computed(() => settings().formSize);
// 表单实例对象
const ruleFormRef = ref<FormInstance>();
// 验证规则
const rules = reactive<FormRules>({
  username: [
    {
      validator: (rule, value, callback) => {
        validatorFunction(
          value,
          callback,
          'username',
          '账号长度在5~20之间 只能包含字母、数字'
        );
      },
      trigger: 'blur',
      required: true
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        validatorFunction(
          value,
          callback,
          'password',
          '密码长度在5~20之间 只能包含字母、数字'
        );
      },
      trigger: 'blur',
      required: true
    }
  ],
  role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
});
// 定义角色数据
interface Role {
  id: number;
  title: string;
  name: string;
}
// 初始化数据
const roleArr = ref<Role[]>([]);
// 获取数据
onMounted(async () => {
  // 获取菜单数据
  const result = await getAllData('role');
  Object.assign(roleArr, result.data);
  // 判断是否有id
  if (id && id !== 0) {
    const Info = await getOneDataById(id, 'admin');
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
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise<void>((resolve, reject) => {
        update(id, form, 'admin')
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
