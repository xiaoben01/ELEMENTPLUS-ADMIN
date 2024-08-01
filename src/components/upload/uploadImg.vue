<!--
 * @Description: 上传组件二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="container">
    <el-container>
      <el-header height="40px">
        <el-upload :action="upload_path" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :data="upParma">
          <el-button type="primary" :size="formSize">上传图片</el-button>
        </el-upload>
        <div>
          <el-button type="warning" :size="formSize" @click="emptying">清空选项</el-button>
          <el-button type="success" :size="formSize" @click="useImg">确认使用</el-button>
          <el-button type="danger" :size="formSize" @click="del">删除</el-button>
        </div>
      </el-header>
      <el-main>
        <div v-for="(item, i) in imgArr" :key="i" class="imgBorder" @click="checkedImg(item.id)">
          <el-image :src="item.path"></el-image>
          <div>
            <div class="checkedImg" v-if="imgIndex.indexOf(item.id) !== -1">
              <el-icon class="op0"><Check /></el-icon>
            </div>
          </div>
        </div>
      </el-main>
      <el-footer>
        <Pagination :total="total" v-model:page="page" v-model:size="size" :layout="'prev, pager, next'" @pagination="getListData" />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { getImglist, delImg, getImgByIds, getToken, saveImg } from '@/common/api';
import { UploadRawFile, UploadProps, ElMessage } from 'element-plus';
// 引入状态管理
import useStore from '@/store';
// 状态管理
const { settings } = useStore();
// 获取formSize状态
const formSize = computed(() => settings().formSize);
// 上传路径
const upload_path = import.meta.env.VITE_BUILD_UPLOAD_URL;
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
  }
});
const upParma = ref({ token: '' });
const limit = computed(() => props.limit);
// 默认选中的图片id
const imgIndex = ref<number[]>([]);
// 回调函数
const emit = defineEmits(['selected-img']);
/**
 * 图片上传成功回调
 *
 * @param params
 */
const handleSuccess: UploadProps['onSuccess'] = async (response) => {
  // 上传API调用
  // 判断upload_path是否含有http或者https
  if (upload_path.indexOf('http') !== -1 && upload_path.indexOf('https') !== -1) {
    await saveImg({ path: response.key });
  }
  page.value = 1;
  getListData();
};

/**
 * 限制用户上传文件的格式和大小
 */
const handleBeforeUpload = function (file: UploadRawFile): boolean {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning('上传图片不能大于2M');
    return false;
  }
  if (['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) === -1) {
    ElMessage.warning('请上传正确的图片格式');
    return false;
  }
  return true;
};
/**
 * 清空选项
 */
const emptying = (): void => {
  imgIndex.value = [];
};
/**
 * 删除
 */
const del = async (): Promise<any> => {
  if (imgIndex.value.length === 0) {
    ElMessage.warning('请选择要删除的图片');
    return false;
  }
  const res = await delImg({ ids: imgIndex.value.join(',') });
  if (res.code === 200) {
    ElMessage.success(res.msg);
    imgIndex.value = [];
    page.value = 1;
    getListData();
  } else {
    ElMessage.warning('请求异常');
  }
};
/**
 * 使用图片
 */
const useImg = (): void => {
  if (imgIndex.value.length === 0) {
    ElMessage.warning('请选择要使用的图片');
    return;
  }
  getImgByIds({ ids: imgIndex.value.join(',') })
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        if (limit.value === 1) {
          emit('selected-img', res.data, props.name, props.paths, true);
        } else {
          emit('selected-img', res.data, props.name, props.paths, false);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
// 列表默认总数
const total = ref(0);
// 当前页
const page = ref(1);
// 每页条数
const size = ref(15);

// 获取数据
// 获取数据
onMounted(async () => {
  getListData();
  getQiniuToken();
});
// 获取七牛云token
const getQiniuToken = async (): Promise<any> => {
  const res = await getToken();
  upParma.value.token = res.data;
};
interface Img {
  id: number;
  path: string;
}
// 图片列表
const imgArr = ref<Img[]>([]);
// 获取数据
const getListData = async (): Promise<any> => {
  const res = await getImglist({ page: page.value, limit: size.value });
  // 删除 imgArr.value 中原有的属性值
  imgArr.value = [];
  Object.assign(imgArr.value, res.data);
  total.value = res.total;
};
const checkedImg = (i: number): void => {
  if (limit.value === 1) {
    imgIndex.value = [];
    imgIndex.value.push(i);
  } else {
    if (imgIndex.value.indexOf(i) === -1) {
      if (imgIndex.value.length < limit.value) {
        imgIndex.value.push(i);
      } else {
        ElMessage.warning('当前只允许选择' + limit.value + '张图片');
      }
    } else {
      imgIndex.value.splice(imgIndex.value.indexOf(i), 1);
    }
  }
};
</script>
<style scoped lang="scss">
.imgBorder {
  padding: 5px;
  position: relative;
  margin-right: 5px;
  border: 1px solid #f8f8f8;
}
.el-image {
  width: 100px;
  height: 100px;
}
.el-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkedImg {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  color: #ffffff;
  background: rgba(6, 247, 54, 0.815);
  opacity: 0.7;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
}
.op0 {
  opacity: 1;
}
</style>
