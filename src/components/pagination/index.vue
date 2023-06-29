<!--
 * @Description: el-pagination 二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="margin-top-10">
    <el-pagination
      background
      v-model:current-page="curPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      :hide-on-single-page="isHidden"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" name="Pagination">
import { computed } from 'vue';
const props = defineProps({
  page: { type: Number, default: 1 },
  size: { type: Number, default: 15 },
  total: { type: Number, default: 0 },
  layout: { type: String, default: 'total, sizes, prev, pager, next, jumper' },
  pageSizes: {
    type: Array as () => Array<number>,
    default: () => [15, 30, 50, 100]
  }
});

const emit = defineEmits(['update:size', 'update:page', 'pagination']);
// 是否隐藏
const isHidden = computed(() => props.total <= 1);
const layout = computed(() => props.layout);
const pageSize = computed({
  get: () => props.size,
  set: (val) => {
    emit('update:size', val);
  }
});
const curPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val);
  }
});

function handleSizeChange(): void {
  emit('pagination');
}

function handleCurrentChange(): void {
  emit('pagination');
}
</script>

<style scoped lang="scss">
.margin-top-10 {
  margin-top: 10px;
}
</style>
