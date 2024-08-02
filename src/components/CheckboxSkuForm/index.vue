<template>
  <div>
    <div>
      <div v-if="specData.specList.length > 0" class="elementPlus-admin-div-flex">
        <div v-for="(item, index) in specData.specList" :key="index" class="elementPlus-admin-col-8">
          <el-card class="elementPlus-admin-ml-10 elementPlus-admin-mr-10">
            <template #header>
              <div class="card-header">
                <el-checkbox v-model="checkAll[index]" :indeterminate="isIndeterminate[index]" @change="handleCheckAllChange(checkAll[index], index, item.label)">
                  <b>{{ item.label }}</b>
                </el-checkbox>
              </div>
            </template>
            <div style="display: flex; flex-wrap: wrap; gap: 10px 0">
              <el-checkbox-group v-model="checkboxSelect[item.label]">
                <el-checkbox @change="handleCheckedCitiesChange(index, item.label)" v-for="(tagName, tagIndex) in item.tags" :key="tagIndex" :label="tagName" :value="tagName">
                  {{ tagName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-table :data="tableSkuList" class="elementPlus-admin-ml-10 elementPlus-admin-mt-10 elementPlus-admin-mr-10" border style="width: 100%" row-key="id" default-expand-all>
      <el-table-column v-for="(item, index) in checkboxSelect" :label="index.toString()" :key="index">
        <template #default="scope">
          <span>{{ scope.row[scope.column.label] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in props.structure" :label="item.label" :key="index">
        <template #default="scope">
          <div v-if="item.type === 'input-number'">
            <el-input-number :size="formSize" :min="0" v-model="submitList[scope.$index][item.key]" :precision="item.precision" controls-position="right" :disabled="item.disabled" />
          </div>
          <div v-if="item.type === 'input'">
            <el-input v-model="submitList[scope.$index][item.key]" :disabled="item.disabled" :size="formSize" />
          </div>
          <div v-else-if="item.type === 'select'">
            <el-select :size="formSize" v-if="item.precision > 0" v-model="submitList[scope.$index][item.key]" multiple collapse-tags filterable clearable placeholder="请选择物料">
              <el-option v-for="optionItem in props.matterCodesList" :key="optionItem.code" :label="optionItem.title" :value="optionItem.code" />
            </el-select>
            <el-select :size="formSize" v-else v-model="submitList[scope.$index][item.key]" filterable clearable placeholder="请选择物料">
              <el-option v-for="optionItem in props.matterCodesList" :key="optionItem.code" :label="optionItem.title" :value="optionItem.code" />
            </el-select>
          </div>
          <div v-else-if="item.type === 'json'">
            <div class="card-header">
              <div>
                <p v-for="item1 in submitList[scope.$index][item.key]" :key="item1.code">{{ item1.title }}{{ item1.num }}{{ item1.unit }}</p>
              </div>
              <div>
                <el-button :size="formSize" @click="addMatterJson(scope.$index, item.key)" type="success">添加物料</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <matterSelect
      v-model:isShow="matterParams.isShow"
      :cup-max="props.cupMax"
      :matter-json="matterParams.matterJson"
      :matter-codes-list="matterCodesList"
      @update:is-show="handleUpdateIsShow"
      @selected-matter="useMatter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import useStore from '@/store';
// ------------类型----------------
interface SpecData {
  specList: { label: string; tags: [] }[];
  skuValue: { [x: string]: any };
}
interface SubmitList {
  [x: string]: any;
}
interface CheckboxSelect {
  [x: string]: any;
}
interface StructureItemType {
  key: string;
  type: string;
  label: string;
  disabled: boolean;
  precision: number;
}
interface Children {
  id: number;
  name: string;
  specId: string;
}
interface SourceAttribute {
  id: number;
  name: string;
  children: Children[];
}
interface MatterCodesList {
  code: string;
  id: number;
  title: string;
}
interface NewArr {
  index: number | string;
  name: string;
  totalNum: string;
  totalPrice: string;
}
// ------------类型----------------
const props = defineProps({
  /**
   * 表格结构，注意name字段，用于输出sku数据
   */
  structure: {
    type: Array as () => StructureItemType[],
    default: () => [
      { key: 'price', label: '价格' },
      { key: 'stock', label: '库存' }
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
  option: {
    type: Array,
    default: () => []
  },
  sku: {
    type: Array,
    default: () => []
  },
  submitList: {
    type: Array as () => SubmitList[],
    default: () => []
  },
  ids: {
    type: Array,
    default: () => []
  },
  matterCodesList: {
    type: Array as () => MatterCodesList[],
    default: () => []
  },
  cupMax: {
    type: Number,
    default: () => 0
  }
});
// ------------变量----------------
const { settings } = useStore();
const formSize = computed(() => settings().formSize);
const tableSkuList = ref([]); // table显示数量和显示值
const submitList = ref<SubmitList>([]);
const specData = reactive<SpecData>({ specList: [], skuValue: {} });
const checkAll = ref<any>([]);
const isIndeterminate = ref<any>([]);
const checkboxSelect = ref<CheckboxSelect>({});
const emit = defineEmits(['select-sku']);
const matterParams = ref({
  isShow: false,
  matterJson: []
});
const newArr = reactive<NewArr>({
  index: '',
  name: '',
  totalNum: 'totalML',
  totalPrice: 'totalPrice'
});
// ------------变量----------------
watch(
  () => [props.sourceAttribute, props.option, props.submitList],
  () => {
    if (props.sourceAttribute.length > 0) {
      checkAll.value = new Array(props.sourceAttribute.length).fill(false);
      isIndeterminate.value = new Array(props.sourceAttribute.length).fill(true);
      props.sourceAttribute.forEach((item: any) => {
        checkboxSelect.value[item.name] = [];
        const specList = item.children.map((child: { name: any }) => child.name).flat();
        specData.specList.push({ label: item.name, tags: specList });
        item.children.forEach((t: any) => {
          if (!specData.skuValue[item.name]) {
            specData.skuValue[item.name] = [t.name];
          } else {
            specData.skuValue[item.name].push(t.name);
          }
        });
      });
      if (props.option.length > 0) {
        props.option.forEach((item: any) => {
          for (const key in item) {
            item[key].forEach((t: any) => {
              if (!checkboxSelect.value[key]) {
                checkboxSelect.value[key] = [t];
              } else {
                checkboxSelect.value[key].push(t);
              }
            });
          }
        });
      }
      if (props.submitList.length > 0) {
        submitList.value = props.submitList;
        tableSKU(checkboxSelect.value);
      }
    }
  },
  { deep: true }
);
// ------------function----------------
const handleCheckAllChange = (val: boolean, index: number, label: string): void => {
  checkboxSelect.value[label] = val ? specData.specList[index].tags : [];
  isIndeterminate.value[index] = false;
  tableSKU(checkboxSelect.value);
};
function handleCheckedCitiesChange(index: number, label: string): void {
  const checkedCount = checkboxSelect.value[label].length;
  checkAll.value[index] = checkedCount === specData.specList[index].tags.length;
  isIndeterminate.value[index] = checkedCount > 0 && checkedCount < specData.specList[index].tags.length;
  tableSKU(checkboxSelect.value);
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
        const oldSpec: any = submitList.value?.[index];
        if (oldSpec) {
          Object.assign(skuObj.value, {
            id: oldSpec.id || oldSpec._value?.id || 0,
            [`skuName${count.value}`]: hader,
            [`skuValue${count.value}`]: el[hader],
            price: oldSpec.price || oldSpec._value?.price || 0,
            matterCodes: oldSpec.matterCodes || oldSpec._value?.matterCodes || []
          });
        } else {
          Object.assign(skuObj.value, {
            id: 0,
            [`skuName${count.value}`]: hader,
            [`skuValue${count.value}`]: el[hader],
            price: 0,
            matterCodes: []
          });
        }
      }
    }
    specItems.push(skuObj.value);
  }
  submitList.value = specItems;
  emit('select-sku', submitList.value);
  return temp;
}
const addMatterJson = (index: number | string | any, name: string): void => {
  matterParams.value.matterJson = submitList.value[index][name];
  newArr.index = index;
  newArr.name = name;
  matterParams.value.isShow = true;
};

/** 物料插件方法   */
const handleUpdateIsShow = (val: boolean): void => {
  matterParams.value.isShow = false;
};
const useMatter = (matterJson: any, totalML: number, totalPrice: number): void => {
  submitList.value[newArr.index][newArr.name] = matterJson;
  submitList.value[newArr.index][newArr.totalNum] = totalML;
  submitList.value[newArr.index][newArr.totalPrice] = totalPrice;
  matterParams.value.isShow = false;
};
</script>

<style lang="scss" scoped></style>
