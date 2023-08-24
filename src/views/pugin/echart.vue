<template>
  <div class="elementPlus-admin-h-100">
    <div class="main-page">
      <el-card class="box-card">
        <MyEchart :options="options" style="height: 300px"></MyEchart>
      </el-card>
      <el-card class="box-card">
        <MyEchart :options="options1" style="height: 300px"></MyEchart>
      </el-card>
      <el-card class="box-card">
        <MyEchart :options="options2" style="height: 300px"></MyEchart>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const options = reactive({
  title: {
    text: '饼状图',
    subtext: 'Fake Data',
    left: 'left'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});
const options1 = reactive({
  legend: {
    data: ['兑换', '购买', '消耗']
  },
  tooltip: {
    trigger: 'axis', // 触发类型为坐标轴
    axisPointer: {
      type: 'cross' // 十字准星指示器
    }
  },
  title: {
    text: '折线图',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['2023-08-18', '2023-08-19', '2023-08-20', '2023-08-21', '2023-08-22', '2023-08-23', '2023-08-24']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '兑换',
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: '购买',
      type: 'line',
      data: [10, 52, 200, 334, 390, 330, 220]
    },
    {
      name: '消耗',
      type: 'line',
      data: [350, 420, 500, 550, 600, 700, 800]
    }
  ]
});
const options2 = reactive({
  title: {
    text: '饼状统计图',
    left: 'left'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    left: 'center',
    data: ['搜索引擎', '直接访问', '邮件营销', '联盟广告', '视频广告']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true,
        length: 20,
        smooth: 0.5
      },
      data: [
        { value: 335, name: '搜索引擎' },
        { value: 310, name: '直接访问' },
        { value: 234, name: '邮件营销' },
        { value: 135, name: '联盟广告' },
        { value: 1548, name: '视频广告' }
      ]
    }
  ]
});
</script>
