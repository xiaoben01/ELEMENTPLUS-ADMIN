<!--
 * @Description: 用户信息组件
 * @Author: xiaoben(xiaoben0527@qq.com)
 * 
-->
<template>
  <div class="app-user-info">
    <el-dropdown
      class="user-info-dropdown"
      placement="bottom"
      @visible-change="handelVisibleChange"
    >
      <div class="user-info-wrapper">
        <div class="user-avatar">
          <el-avatar :size="40" :src="avatar" />
        </div>
        <div class="user-content" v-if="showUserInfo">
          <div class="user-content-inner">
            <div class="user-name">{{ userInfo?.name }}</div>
            <div class="user-role" v-if="userInfo?.roleName">
              {{ userInfo?.roleName }}
            </div>
          </div>
        </div>
        <div class="user-arrow" :class="{ active }">
          <svg-icon icon="arrow-bottom" size="12" />
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided @click="handleLogout">
            <svg-icon class-name="svg-icon-right" icon="off" size="14" />
            <span>安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import useStore from '@/store';
import setting from '@/common/setting';

// 创建 store 实例
const { user, settings } = useStore();

// emit
const emit = defineEmits(['logout']);

// 下拉菜单激活时箭头方向状态
const active = ref<boolean>(false);

// 用户信息
const userInfo = computed(() => user().info);
const showUserInfo = computed(() => settings().showUserInfo);
const avatar = computed(() => userInfo?.value?.avatar || setting.avatar);

// 设置箭头方向状态
const handelVisibleChange = (): void => {
  active.value = !active.value;
};

// 退出/注销
const handleLogout = (): void => {
  emit('logout');
};
</script>
