<template>
  <el-dialog v-model="isShow" :modal="props.modal" width="60%" title="选择物料" :before-close="handleClose" align-center>
    <el-button @click="addSign" :size="formSize" type="success">添 加</el-button>
    <el-button @click="submitMatterJson" :size="formSize" type="primary">确 定</el-button>
    <br />
    <draggable v-model="matterJson" item-key="uuId">
      <template #item="{ element, index }">
        <div>
          <div style="margin-top: 10px">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-select
                  :size="formSize"
                  :disabled="element.code === 'TeaCup' || element.code === 'TeaCover' ? true : false"
                  v-model="element.code"
                  filterable
                  clearable
                  @change="changeMatterJson(index, element.code)"
                  placeholder="请选择物料"
                >
                  <el-option
                    :disabled="item1.code === 'TeaCup' || item1.code === 'TeaCover' ? true : false"
                    v-for="item1 in matterCodesList"
                    :key="item1.code"
                    :label="item1.title"
                    :value="item1.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input-number
                  :size="formSize"
                  :disabled="element.code === 'TeaCup' || element.code === 'TeaCover' ? true : false"
                  controls-position="right"
                  @change="TotalML"
                  v-model="element.num"
                ></el-input-number>
              </el-col>
              <el-col :span="2">
                <span style="line-height: 32px">
                  {{ element.unit }}
                </span>
              </el-col>
              <el-col :span="4">
                <span style="line-height: 32px">
                  <el-input-number :size="formSize" :disabled="true" controls-position="right" v-model="element.unitPrice"></el-input-number>
                </span>
              </el-col>
              <el-col :span="2">
                <el-button :size="formSize" v-if="element.code !== 'TeaCup' && element.code !== 'TeaCover'" @click="delSign(index)" type="danger">删 除</el-button>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 10px" v-if="index === matterJson.length - 1">
            <el-row :gutter="20">
              <el-col :span="4" style="line-height: 32px">&nbsp;</el-col>
              <el-col :span="4">
                <el-input-number :size="formSize" :disabled="true" controls-position="right" v-model="totalNum"></el-input-number>
              </el-col>
              <el-col :span="2">
                <span style="line-height: 32px">ML</span>
              </el-col>
              <el-col :span="4">
                <el-input-number :size="formSize" :disabled="true" controls-position="right" v-model="totalPrice"></el-input-number>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </draggable>
  </el-dialog>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';
import useStore from '@/store';
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import _ from 'lodash';
interface MatterCodesList {
  code: string;
  title: string;
  unit: string;
  unitPrice: string;
}
interface MatterJson {
  code: number | string;
  num: number;
  title: string | undefined;
  unit: string | undefined;
  uuId: string | undefined;
  unitPrice: number;
}
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  modal: {
    type: Boolean,
    default: true
  },
  matterCodesList: {
    type: Array as () => MatterCodesList[],
    default: () => []
  },
  matterJson: {
    type: Array as () => MatterJson[],
    default: () => []
  },
  cupMax: {
    type: Number,
    default: () => 0
  }
});
const { settings } = useStore();
const formSize = computed(() => settings().formSize);
const totalNum = ref(0);
const totalPrice = ref(0);
const matterCodesList = ref<MatterCodesList[]>([]);
const matterJson = ref<MatterJson[]>([]);
const isShow = computed({
  get: () => props.isShow,
  set: (val) => {
    emit('update:isShow', val);
  }
});
watch(
  () => [props.isShow, props.matterCodesList, props.matterJson],
  () => {
    if (props.isShow === true) {
      if (props.matterCodesList.length > 0) {
        matterCodesList.value = props.matterCodesList;
      }
      if (props.matterJson.length > 0) {
        matterJson.value = _.cloneDeep(props.matterJson);
        addMatterJson();
      } else {
        matterJson.value = [
          {
            code: 'TeaCup',
            num: 1,
            title: '杯',
            unit: '个',
            uuId: uuidv4(),
            unitPrice: 0.4
          },
          {
            code: 'TeaCover',
            num: 1,
            title: '盖',
            unit: '个',
            uuId: uuidv4(),
            unitPrice: 0.4
          }
        ];
        addMatterJson();
      }
    }
  }
);
function addMatterJson(): void {
  matterJson.value.forEach((item: any) => {
    const matter = matterCodesList.value.find((item2: any) => item2.code === item.code);
    item.unit = matter?.unit;
    item.unitPrice = matter?.unitPrice;
    item.title = item.title === undefined ? matter?.title : item.title;
    item.uuId = item.uuId === undefined ? uuidv4() : item.uuId;
  });
  TotalML();
  TotalPrice();
}
const emit = defineEmits(['update:isShow', 'selected-matter']);
const addSign = (): void => {
  matterJson.value.splice(matterJson.value.length - 1, 0, {
    code: '',
    num: 1,
    title: '',
    unit: '',
    uuId: uuidv4(),
    unitPrice: 0
  });
};
const TotalML = (): void => {
  totalNum.value = matterJson.value
    .filter((item) => item.unit === 'ml' || item.unit === 'g' || item.unit === '克')
    .map((item) => item.num)
    .reduce((acc, curr) => acc + curr, 0);
  TotalPrice();
};
const TotalPrice = (): void => {
  totalPrice.value = parseFloat(
    matterJson.value
      .map((item) => item.unitPrice * item.num)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(4)
  );
};
const delSign = (index: number): void => {
  matterJson.value.splice(index, 1);
  TotalML();
};
const submitMatterJson = (): void => {
  const codeSet = new Set(); // 使用Set来存储已经出现过的code
  for (let i = 0; i < matterJson.value.length; i++) {
    if (!matterJson.value[i].code) {
      ElMessage({
        message: '物料不能有空选择',
        type: 'warning'
      });
      return;
    }
    if (codeSet.has(matterJson.value[i].code)) {
      ElMessage({
        message: '物料不能重复选择',
        type: 'warning'
      });
      return;
    }
    codeSet.add(matterJson.value[i].code);
  }
  const mlItems = matterJson.value
    .filter((item) => item.unit === 'ml' || item.unit === 'g' || item.unit === '克')
    .map((item) => item.num)
    .reduce((acc, curr) => acc + curr, 0);
  if (mlItems >= props.cupMax) {
    ElMessage({
      message: '物料不能超过' + props.cupMax + 'ml',
      type: 'warning'
    });
    return;
  }
  emit('selected-matter', matterJson.value, totalNum.value, totalPrice.value);
};
const handleClose = (): void => {
  emit('update:isShow', false);
};
const changeMatterJson = (index: number, val: number | string | boolean): void => {
  const matter = matterCodesList.value.find((item: any) => item.code === val);
  matterJson.value[index].title = matter?.title;
  matterJson.value[index].unit = matter?.unit;
  matterJson.value[index].unitPrice = parseFloat(matter!.unitPrice);
  TotalML();
  TotalPrice();
};
</script>
<style lang="scss" scoped></style>
