<!--
 * @Description: 模型管理
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
          <el-form-item label="父级菜单">
            <el-tree-select
              check-strictly
              v-model="form.parentId"
              :data="menuArr"
              :render-after-expand="false"
            />
          </el-form-item>
          <el-form-item label="路由名称(name)" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="路由路径(path)" prop="path">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
          <el-form-item label="页面地址(component)" prop="component">
            <el-input v-model="form.component"></el-input>
          </el-form-item>
          <el-form-item label="标题名称(title)" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="tooltip-wrapper">
                <span class="margin-right-5">路由重定向(redirect)</span>
                <el-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    例：/model/edit，当设置为
                    <br />
                    noRedirect 的时候该路由在
                    <br />
                    面包屑导航中不可被点击。
                  </template>
                  <el-icon :size="16"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input v-model="form.redirect" :disabled="isDisabled"></el-input>

            <el-checkbox
              v-model="form.redirect"
              true-label="noRedirect"
              false-label=""
              label="noRedirect"
              @change="changeRedirect"
            >
              设置为 noRedirect
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="tooltip-wrapper">
                <span class="margin-right-5">高亮菜单(activeMenu)</span>
                <el-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    当路由设置了该属性，则会高
                    <br />
                    高亮相对应的侧边栏。
                    <br />
                    例：/model/edit
                  </template>
                  <el-icon :size="16"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input v-model="form.activeMenu"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标(icon)">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="tooltip-wrapper">
                <span class="margin-right-5">排序(sort)</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="数字越小越靠前"
                  placement="top"
                >
                  <el-icon :size="16"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number
              :min="0"
              v-model="form.sort"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="隐藏菜单(hidden)">
            <el-switch
              v-model="form.hidden"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="显示根节点(alwaysShow)">
            <el-switch
              v-model="form.alwaysShow"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="无缓存(noCache)">
            <el-switch
              v-model="form.noCache"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="面包屑中显示(breadcrumb)">
            <el-switch
              v-model="form.breadcrumb"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="固定在标签栏(affix)">
            <el-switch
              v-model="form.affix"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="不在标签栏显示(noTags)">
            <el-switch
              v-model="form.noTags"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="展开当前菜单(open)">
            <el-switch
              v-model="form.open"
              :active-value="1"
              :inactive-value="0"
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
// 引入路由
import { useRoute } from 'vue-router';
// 引入状态管理
import useStore from '@/store';
// 引入接口
import { getMenuAll, getOneDataById, update } from '@/common/api';
// 引入表单验证
import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus';
import { closeSelectedTag } from '@/common/utils';
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  component: [{ required: true, message: '请输入页面地址', trigger: 'blur' }]
});
// 状态管理
const { settings } = useStore();
// 获取路由
const route = useRoute();
// 获取formSize状态
const size = computed(() => settings().formSize);
// 定义是否禁用
const isDisabled = computed(() => {
  return form.redirect === 'noRedirect';
});
// 获取url参数
const id: number = parseInt(route.params.id as string);
// 定义表单数据
const form = reactive({
  parentId: 0,
  sort: 0,
  name: '',
  path: '',
  component: '',
  redirect: '',
  hidden: 0,
  alwaysShow: 1,
  title: '',
  icon: '',
  noCache: 0,
  breadcrumb: 1,
  affix: 0,
  noTags: 0,
  open: 0,
  activeMenu: ''
});
// 初始化数据
const menuArr = reactive([]);
// 获取数据
onMounted(async () => {
  // 获取菜单数据
  const result = await getMenuAll();
  Object.assign(menuArr, result.data);
  // 判断是否有id
  if (id && id !== 0) {
    const Info = await getOneDataById(id, 'controllers');
    Object.assign(form, Info.data);
  }
});

// 关闭tabs页面
const cancel = (): void => {
  closeSelectedTag(route);
};

// 监听重定向选中
const changeRedirect = (val: string | number | boolean): void => {
  if (val) {
    form.redirect = 'noRedirect';
  } else {
    form.redirect = '';
  }
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
        update(id, form, 'controllers')
          .then((resp) => {
            loading.close();
            if (resp.code === 200) {
              ElMessage({
                message: resp.msg,
                type: 'success'
              });
              // 关闭tabs页面
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

<style lang="scss" scoped>
.tooltip-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.margin-right-5 {
  margin-right: 5px;
}
</style>
