<!--
 * @Description: 路由重定向
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div />
</template>
<script setup lang="ts">
import { unref } from 'vue';
import { useRouter } from 'vue-router';

const { currentRoute, replace } = useRouter();
const { params, query } = unref(currentRoute);
const { path, redirectType = 'path' } = params;

Reflect.deleteProperty(params, '_redirect_type');
Reflect.deleteProperty(params, 'path');

const _path = Array.isArray(path) ? path.join('/') : path;
setTimeout(() => {
  if (redirectType === 'name') {
    replace({
      name: _path,
      query,
      params
    });
  } else {
    replace({
      path: _path.startsWith('/') ? _path : `/${_path}`,
      query
    });
  }
});
</script>
