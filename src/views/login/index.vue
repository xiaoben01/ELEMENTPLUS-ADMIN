<!--
 * @Description: 登录页
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="app-login">
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-form">
          <div class="login-title">
            <img class="title-img" :src="setting.logo" v-if="setting.logo" />
            <div class="title-text" v-if="setting.title">
              {{ setting.title }}
            </div>
          </div>
          <el-form
            ref="loginFormRef"
            size="large"
            :model="loginForm"
            :rules="loginFormRules"
          >
            <el-form-item prop="username">
              <el-input placeholder="用户名" v-model="loginForm.username">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                show-password
                placeholder="密码"
                type="password"
                v-model="loginForm.password"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="app-width-full"
                @click="handelLogin(loginFormRef)"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import useStore from '@/store';
import setting from '@/common/setting';

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  username: 'admin',
  password: 'admin',
  verifyCode: ''
});

const loginFormRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

// 创建 store 实例
const { user } = useStore();

// 创建 router 实例
const router = useRouter();

// 记录路由重定向
const redirect = ref<any>(null);
// 其他参数
const otherQuery = ref<any>({});

// 设置路由其他参数
const getOtherQuery = (query: any): any => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {} as any);
};

// 路由监听
watch(
  () => router.currentRoute.value,
  (route) => {
    const query = route.query;
    redirect.value = query?.redirect;
    otherQuery.value = getOtherQuery(query);
  },
  { immediate: true }
);

// 登录
const handelLogin = async (formEl: FormInstance | undefined): Promise<any> => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      user()
        .login({
          username: loginForm.username,
          password: loginForm.password
        })
        .then((res: any) => {
          // console.log('登录成功', res);
          router.push({
            path: redirect.value || '/',
            query: otherQuery.value
          });
        });
    }
  });
};
</script>
