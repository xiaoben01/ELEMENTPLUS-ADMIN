<!--
 * @Description: 修改密码
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
          <el-form-item label="原密码" prop="oldpassword">
            <el-input v-model="form.oldpassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input v-model="form.repassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(ruleFormRef)">
              保 存
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
// 引入状态管理
import useStore from '@/store';
import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus';
// 引入工具函数的验证方法
import { validatorFunction, closeSelectedTag } from '@/common/utils';
import { useRoute } from 'vue-router';
import { setPassword } from '@/common/api';
// 获取路由
const route = useRoute();

// 定义表单数据
const form = reactive({
  oldpassword: '',
  password: '',
  repassword: ''
});
// 状态管理
const { settings } = useStore();
// 获取formSize状态
const size = computed(() => settings().formSize);
// 表单实例对象
const ruleFormRef = ref<FormInstance>();
// 验证规则
const rules = reactive<FormRules>({
  oldpassword: [
    {
      validator: (rule, value, callback) => {
        validatorFunction(
          value,
          callback,
          'username',
          '密码长度在5~20之间 只能包含字母、数字'
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
  repassword: [
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
  ]
});

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
        setPassword(form)
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
