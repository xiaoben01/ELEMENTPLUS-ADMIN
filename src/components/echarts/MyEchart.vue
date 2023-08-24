<template>
  <div ref="chartRef" class="my-chart"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import echarts from './echarts';

// 定义 props，接收一个 options 属性，类型为 ChartOptions
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
});
// 定义 chartRef，用于引用图表容器元素
const chartRef = ref<HTMLDivElement>();
// 定义 chart，用于引用图表实例
let chart: echarts.ECharts | null = null;
// 定义 resizeHandler，用于在窗口大小变化时调整图表大小
const resizeHandler = (): void => {
  chart?.resize();
};
// 在组件挂载时初始化图表，并添加 resize 事件监听器
onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeHandler);
});
watch(
  () => props.options,
  () => {
    console.log('options changed');
    chart?.setOption({
      ...props.options
    });
  },
  { deep: true }
);
// 定义 initChart，用于初始化图表
const initChart = (): void => {
  // 创建图表实例，并将其绑定到 chartRef 引用的元素上
  chart = echarts.init(chartRef.value as HTMLDivElement);
  // 设置图表的配置项和数据
  chart.setOption({
    ...props.options
  });
};
// 在组件卸载时移除 resize 事件监听器，并销毁图表实例
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
  chart?.dispose();
});
</script>

<style lang="scss" scoped></style>
