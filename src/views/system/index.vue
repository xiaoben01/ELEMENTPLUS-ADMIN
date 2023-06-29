<!--
 * @Description: 系统设置
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
          label-width="120px"
          :size="size"
        >
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="平台管理" name="first">
              <el-form-item label="平台名称">
                <el-input
                  class="w80p"
                  v-model="form.title"
                  maxlength="30"
                  placeholder="请输入平台名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="客服电话">
                <el-input v-model="form.tel"></el-input>
              </el-form-item>
              <el-form-item label="关于我们">
                <Tinymce
                  ref="aboutUs"
                  v-model="form.aboutUs"
                  name="aboutUs"
                  @get-content="getAboutUs"
                />
              </el-form-item>
              <el-form-item label="注册协议">
                <Tinymce
                  ref="userAgree"
                  v-model="form.userAgree"
                  name="userAgree"
                  @get-content="getUserAgree"
                />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="分享配置" name="second">
              <el-form-item label="分享标题">
                <el-input v-model="form.shareTitle"></el-input>
              </el-form-item>
              <el-form-item label="分享描述">
                <el-input v-model="form.shareDesc"></el-input>
              </el-form-item>
              <el-form-item label="分享图片">
                <div class="image-select">
                  <el-image
                    v-show="form.shareImgPath"
                    :src="qiniuUrl + form.shareImgPath"
                  ></el-image>
                </div>
                <el-button type="text" @click="centerDialogVisible = true">
                  选择图片
                </el-button>
                <el-dialog
                  v-model="centerDialogVisible"
                  width="50%"
                  title="选择图片"
                  :modal="false"
                >
                  <uploadImg
                    :limit="1"
                    name="shareImg"
                    paths="shareImgPath"
                    @selected-img="selectedImg"
                  />
                </el-dialog>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
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

<script lang="ts" setup>
import { reactive, onMounted, computed, ref } from 'vue';
// 引入状态管理
import useStore from '@/store';
// 引入接口
import { getOneDataById, update, getQiniuUrl } from '@/common/api';
import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus';
import Tinymce from '@/components/tinymce/index.vue';
import uploadImg from '@/components/upload/img.vue';
// 状态管理
const { settings } = useStore();

const centerDialogVisible = ref(false);
// 获取formSize状态
const size = computed(() => settings().formSize);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  tel: [
    {
      required: true,
      message: '请输入客服电话',
      trigger: 'blur'
    },
    { pattern: /^1[34578]\d{9}$/, message: '请输入客服电话', trigger: 'blur' }
  ]
});
// 定义初始tab
const activeName = 'first';
interface Form {
  id: number;
  title: string;
  tel: string;
  shareTitle: string;
  shareDesc: string;
  aboutUs: string;
  userAgree: string;
  shareImg: number;
  shareImgPath: string;
}
// 定义表单数据
const form = reactive<Form>({
  id: 1,
  title: '',
  tel: '',
  shareTitle: '',
  shareDesc: '',
  aboutUs: '',
  userAgree: '',
  shareImg: 0,
  shareImgPath: ''
});
const qiniuUrl = ref('');
// 获取数据
onMounted(async () => {
  getQiniuData();
});
// 获取七牛云地址
const getQiniuData = async (): Promise<any> => {
  const resp = await getQiniuUrl();
  qiniuUrl.value = resp.data;
  getOneData();
};
// 获取单条数据
const getOneData = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    getOneDataById(1, 'config')
      .then((resp) => {
        Object.assign(form, resp.data);
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const getAboutUs = (v: string): void => {
  form.aboutUs = v;
};
const getUserAgree = (v: string): void => {
  form.userAgree = v;
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
        update(form.id, form, 'config')
          .then((resp) => {
            loading.close();
            if (resp.code === 200) {
              ElMessage({
                message: resp.msg,
                type: 'success'
              });
              //重载页面
              window.location.reload();
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
const selectedImg = (
  data: any,
  name: keyof Form,
  paths: keyof Form,
  type: boolean
): void => {
  if (type) {
    (form as any)[name] = data[0].id;
    (form as any)[paths] = data[0].path;
  } else {
    (form as any)[name] = data.map((item: any) => item.id).toString();
    (form as any)[paths] = data;
  }

  centerDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.el-image {
  width: 150px;
  height: 150px;
}
.image-select {
  margin: 2px 5px 2px 0px;
  position: relative;
}
</style>
