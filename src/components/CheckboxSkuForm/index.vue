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
          <div v-if="item.type === 'input'">
            <el-input-number v-if="item.key === 'price'" :min="0" v-model="submitList[scope.$index].value[item.key]" :precision="2" controls-position="right" />
            <el-input-number v-else v-model="submitList[scope.$index].value[item.key]" size="small" />
          </div>
          <div v-else-if="item.type === 'select'">
            <el-select v-if="item.key === 'matterCodes'" v-model="submitList[scope.$index].value[item.key]" multiple collapse-tags filterable clearable placeholder="请选择物料">
              <el-option v-for="optionItem in props.matterCodesList" :key="optionItem.code" :label="optionItem.title" :value="optionItem.code" />
            </el-select>
            <el-select v-else v-model="submitList[scope.$index].value[item.key]" filterable clearable placeholder="请选择物料">
              <el-option v-for="optionItem in props.matterCodesList" :key="optionItem.code" :label="optionItem.title" :value="optionItem.code" />
            </el-select>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
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
  }
});
// ------------变量----------------
const tableSkuList = ref([]); // table显示数量和显示值
const submitList = ref<SubmitList>([]);
const specData = reactive<SpecData>({ specList: [], skuValue: {} });
const checkAll = ref<any>([]);
const isIndeterminate = ref<any>([]);
const checkboxSelect = ref<CheckboxSelect>({});
const emit = defineEmits(['select-sku']);
// ------------变量----------------
watch(
  () => [props.sourceAttribute, props.option, props.submitList],
  () => {
    if (props.sourceAttribute.length > 0) {
      // 将(全选)checkAll数组长度设置为props.sourceAttribute的长度，并赋值为false
      checkAll.value = new Array(props.sourceAttribute.length).fill(false);
      // 将()isIndeterminate数组长度设置为props.sourceAttribute的长度，并赋值为false
      isIndeterminate.value = new Array(props.sourceAttribute.length).fill(true);
      // 循环props.sourceAttribute
      props.sourceAttribute.forEach((item: any) => {
        // 将checkboxSelect.value[item.name]数组长度设置为item.children的长度，并赋值为[]
        checkboxSelect.value[item.name] = [];
        // 获取item.children下的所有name，id值，赋值给specList
        const specList = item.children.map((child: { name: any }) => child.name).flat();
        specData.specList.push({ label: item.name, tags: specList });
        // 循环item的子集，然后把子集的值赋值给skuValue
        item.children.forEach((t: any) => {
          if (!specData.skuValue[item.name]) {
            specData.skuValue[item.name] = [t.name];
          } else {
            specData.skuValue[item.name].push(t.name);
          }
        });
      });
      if (props.option.length > 0) {
        // 循环props.option，判断是否有值，如果有值就赋值给checkboxSelect
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
  // 选中值变更后重新设置tableSKU
  tableSKU(checkboxSelect.value);
};
function handleCheckedCitiesChange(index: number, label: string): void {
  // 获取当前选中数量
  const checkedCount = checkboxSelect.value[label].length;
  // 判断当前选中数量是否等于当前规格的数量
  checkAll.value[index] = checkedCount === specData.specList[index].tags.length;
  // 判断当前选中数量是否大于0并且小于当前规格的数量,如果是则设置isIndeterminate为true
  isIndeterminate.value[index] = checkedCount > 0 && checkedCount < specData.specList[index].tags.length;
  // console.log(checkboxSelect.value);
  // 选中值变更后重新设置tableSKU
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
        //防止输入的价格和库存数量丢失
        const oldSpec: any = submitList.value?.[index];
        if (oldSpec) {
          //如果有就是给之前的值
          Object.assign(skuObj.value, {
            id: oldSpec.id || oldSpec._value?.id || 0,
            [`skuName${count.value}`]: hader,
            [`skuValue${count.value}`]: el[hader],
            // 判断oldSpec.price是否存在,如果存在就是给之前的值，判断oldSpec._value.price是否存在,如果存在就是给之前的值，否则就是0
            price: oldSpec.price || oldSpec._value?.price || 0,
            matterCodes: oldSpec.matterCodes || oldSpec._value?.matterCodes || []
          });
        } else {
          //如果没有就是正常的给普通的值
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
    specItems.push(skuObj);
  }
  submitList.value = specItems;
  // 使用emit触发父组件的selectSku事件
  emit('select-sku', submitList.value);
  return temp;
}
// -----------function-----------------
</script>

<style lang="scss" scoped></style>
