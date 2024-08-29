<template>
  <div>
    <div class="elementPlus-admin-mb-10 elementPlus-admin-ml-10">
      <el-form style="margin-top: 10px" :inline="true" ref="form">
        <el-form-item label="">
          <el-input v-model="specName" :size="formSize" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :size="formSize" @click="addSpecName()">添加规格名</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div v-if="specData.specList.length > 0" class="elementPlus-admin-div-flex" style="flex-wrap: wrap; gap: 10px 0">
        <div v-for="(item, index) in specData.specList" :key="index" class="elementPlus-admin-col-8">
          <el-card class="elementPlus-admin-ml-10 elementPlus-admin-mr-10">
            <template #header>
              <div class="card-header">
                <span>
                  <b>{{ item.label }}</b>
                </span>
                <span class="elementPlus-admin-ml-15" @click="onDeletSpec(index)">
                  <el-icon style="font-size: 24px">
                    <CircleClose />
                  </el-icon>
                </span>
              </div>
            </template>
            <div style="display: flex; flex-wrap: wrap; gap: 10px 0">
              <div v-for="(tagName, tagIndex) in item.tags" :key="tagIndex">
                <el-tag @close="onDeletSpecValue(index, tagIndex)" closable style="margin: 0 10px">{{ tagName.name }}</el-tag>
              </div>
              <div>
                <el-input
                  v-if="inputIndex === index && inputVisible"
                  :size="formSize"
                  ref="InputRef"
                  v-model="inputTags"
                  @keyup.enter="handleInputConfirm(index, item.label)"
                  @blur="handleInputConfirm(index, item.label)"
                />
                <el-button v-else :size="formSize" @click="onClilkInput(index)">添加规格值</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-table :data="tableSkuList" class="elementPlus-admin-ml-10 elementPlus-admin-mt-10 elementPlus-admin-mr-10" border style="width: 100%" row-key="id" :size="formSize" default-expand-all>
      <el-table-column v-for="(item, index) in specData.specList" :label="item.label" :key="index">
        <template #default="scope">
          <span>{{ scope.row[scope.column.label] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in props.structure" :label="item.label" :key="index">
        <template #default="scope">
          <div v-if="item.type === 'input-number'">
            <el-input-number
              v-if="item.key === 'rewardPercent'"
              :size="formSize"
              :min="0"
              :max="1"
              v-model="submitList[scope.$index][item.key]"
              :precision="item.precision"
              controls-position="right"
              :disabled="item.disabled"
            />
            <el-input-number v-else :size="formSize" :min="0" v-model="submitList[scope.$index][item.key]" :precision="item.precision" controls-position="right" />
          </div>
          <div v-if="item.type === 'input'">
            <el-input v-model="submitList[scope.$index][item.key]" :disabled="item.disabled" :size="formSize" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
/**********  引入  **********/
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, nextTick, Ref, watch, computed } from 'vue';
import useStore from '@/store';
/**********  类型定义  **********/
interface SpecData {
  specList: { label: string; tags: any }[];
  skuValue: { [x: string]: any };
}
interface SubmitList {
  [x: string]: any;
}
interface InputRefType {
  input: HTMLInputElement | null;
}
interface StructureItemType {
  key: string;
  type: string;
  label: string;
  precision: number;
  disabled: boolean;
}
interface Children {
  id: number;
  name: string;
  goodsId: number;
  goodsSpecId: number;
}
interface SourceAttribute {
  id: number;
  goodsId: number;
  name: string;
  children: Children[];
}
/**********  参数  **********/
const props = defineProps({
  /**
   * 表格结构，注意name字段，用于输出sku数据
   */
  structure: {
    type: Array as () => StructureItemType[],
    default: () => [
      { key: 'price', type: 'input', label: '价格' },
      { key: 'stock', type: 'input', label: '库存' }
    ]
  },
  /**
   * 原始规格数据
   * sourceAttribute: [
   *   { name: '颜色', item: ['黑', '金', '白'] },
   *   { name: '内存', item: ['16G', '32G'] },
   *   { name: '运营商', item: ['电信', '移动', '联通'] }
   * ]
   */
  sourceAttribute: {
    type: Array as () => SourceAttribute[],
    default: () => []
  },
  submitList: {
    type: Array as () => SubmitList[],
    default: () => []
  }
});
/**********  变量  **********/
const { settings } = useStore();
const formSize = computed(() => settings().formSize);
const specName = ref('');
const inputTags = ref('');
const inputVisible = ref(false);
const inputIndex = ref(0);
const tableSkuList = ref([]);
const submitList = ref<SubmitList>([]);
const specData = reactive<SpecData>({ specList: [], skuValue: {} });
const InputRef: Ref<InputRefType[]> = ref([{ input: null }]);
const emit = defineEmits(['select-sku']);
/**********  方法  **********/
watch(
  () => [props.sourceAttribute, props.submitList],
  () => {
    if (props.sourceAttribute.length > 0) {
      props.sourceAttribute.forEach((item: any, index: number) => {
        const specList = item.children.map((child: { name: any; id: any }) => ({ name: child.name, id: child.id })).flat();
        specData.specList[index] = { label: item.name, tags: specList };
        item.children.forEach((t: any, i: number) => {
          if (!specData.skuValue[item.name]) {
            specData.skuValue[item.name] = [t.name];
          } else {
            specData.skuValue[item.name][i] = t.name;
          }
        });
      });
    }
    if (props.submitList.length > 0) {
      submitList.value = props.submitList;
      tableSKU(specData.skuValue);
    }
  },
  { deep: true }
);
async function addSpecName(): Promise<void> {
  if (specName.value) {
    specData.specList.push({ label: specName.value, tags: [] });
    specName.value = '';
  } else {
    ElMessage.warning('请输入规格名称');
  }
}
async function handleInputConfirm(index: string | number | any, label: string | number): Promise<void> {
  if (inputTags.value) {
    specData.specList[index].tags.push({ name: inputTags.value });
    if (!specData.skuValue[label]) {
      specData.skuValue[label] = [inputTags.value];
    } else {
      specData.skuValue[label].push(inputTags.value);
    }
    tableSKU(specData.skuValue);
  }
  inputTags.value = '';
  inputVisible.value = !inputVisible.value;
}
function onClilkInput(index: number): void {
  inputIndex.value = index;
  inputVisible.value = !inputVisible.value;
  nextTick(() => {
    InputRef.value[0]?.input?.focus();
  });
}
function onDeletSpec(index: number): void {
  ElMessageBox.confirm('此操作将永久删除该规格及其子规格, 是否继续?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      delete specData.skuValue[specData.specList[index].label];
      specData.specList.splice(index, 1);
      tableSKU(specData.skuValue);
    })
    .catch(() => {
      console.log('取消删除');
    });
}
function onDeletSpecValue(index: string | number | any, tagIndex: any): void {
  ElMessageBox.confirm('此操作将永久删除该规格, 是否继续?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      specData.skuValue[specData.specList[index].label].splice(tagIndex, 1);
      specData.specList[index].tags.splice(tagIndex, 1);
      tableSKU(specData.skuValue);
    })
    .catch(() => {
      console.log('取消删除');
    });
}
function tableSKU(skuObj: { [x: string]: any }): void {
  let temp: any = [];
  for (const key in skuObj) {
    const items = skuObj[key];
    if (!temp.length) {
      temp.push(...items.map((t: any) => ({ [key]: t })));
    } else {
      const i2: any[] = [];
      temp.forEach((obj: any) => {
        if (items.length === 0) {
          i2.push(obj);
        } else {
          i2.push(...items.map((t: any) => ({ ...obj, [key]: t })));
        }
      });
      temp = i2;
    }
  }
  tableSkuList.value = temp;
  const tableHader = Object.keys(skuObj);
  const specItems: any = [];
  for (let index = 0; index < temp.length; index++) {
    const el = temp[index];
    const count = ref(0);
    const skuObj = ref({});
    for (let i = 0; i < tableHader.length; i++) {
      const hader = tableHader[i];
      if (hader) {
        count.value += 1;
        //防止输入的价格和库存数量丢失
        const oldSpec: any = submitList.value?.[index];
        const arr = {
          [`skuName${count.value}`]: hader,
          [`skuValue${count.value}`]: el[hader]
        };
        if (oldSpec) {
          props.structure.forEach((item: { key: string }) => {
            arr[item.key] = oldSpec[item.key] || oldSpec._value?.[item.key] || 0;
          });
        } else {
          props.structure.forEach((item: { key: string }) => {
            arr[item.key] = 0;
          });
        }
        Object.assign(skuObj.value, arr);
      }
    }
    specItems.push(skuObj.value);
  }
  submitList.value = specItems;
  emit('select-sku', submitList.value);
  return temp;
}
</script>

<style lang="scss" scoped></style>
