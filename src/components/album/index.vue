<!--
 * @Description: 上传组件二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div v-if="Array.isArray(props.pathVal)">
    <div class="ele-flex" v-if="props.pathVal">
      <div class="image-select" v-for="(item, i) in props.pathVal" :key="i">
        <el-image :src="item.path"></el-image>
        <div class="checkedImg" @click="delImgIng(item.id, props.name, props.paths, props.limit)">
          <Delete class="op0" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="ele-flex" v-if="props.pathVal">
      <div class="image-select">
        <el-image :src="props.pathVal"></el-image>
        <div class="checkedImg" @click="delImgIng(0, props.name, props.paths, props.limit)">
          <Delete class="op0" />
        </div>
      </div>
    </div>
  </div>
  <el-button link type="primary" :size="formSize" @click="openImgDia(props.name, props.paths, props.limit)">选择图片</el-button>
</template>

<script setup lang="ts">
/**  引用 */
import { computed, PropType } from 'vue';
import useStore from '@/store';
const { settings } = useStore();
const formSize = computed(() => settings().formSize);
const props = defineProps({
  limit: {
    type: Number,
    default: 10
  },
  name: {
    type: String,
    default: null
  },
  paths: {
    type: String,
    default: null
  },
  pathVal: {
    type: [Array as PropType<Array<{ id: number; path: string }>>, String] as PropType<Array<{ id: number; path: string }> | string>,
    default: null
  }
});
const emit = defineEmits(['delImg', 'openImg']);
const delImgIng = (id: number, name: string, paths: string, limit: number): void => {
  emit('delImg', id, name, paths, limit);
};
const openImgDia = (name: string, path: string, limit: number): void => {
  emit('openImg', { name: name, path: path, limit: limit }, true);
};
</script>
<style scoped lang="scss">
.el-image {
  width: 150px;
  height: 150px;
}
</style>
