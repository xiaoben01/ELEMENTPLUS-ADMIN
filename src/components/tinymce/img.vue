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
import { getImglist, saveImg, delImg, getImgByIds } from '@/common/api';
import { UploadRawFile, UploadProps, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import useStore from '@/store';
const { settings } = useStore();
const formSize = computed(() => settings().formSize);
const upload_path = import.meta.env.VITE_BUILD_UPLOAD_URL;
const route = useRoute();
const name: string = route.params.name as string;
const props = defineProps({
  limit: {
    type: Number,
    default: 10
  }
});
const upParma = ref({ token: '' });
const limit = computed(() => props.limit);
const imgIndex = ref<number[]>([]);
/**
 * 图片上传成功回调
 *
 * @param params
 */
const handleSuccess: UploadProps['onSuccess'] = async (response) => {
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
        const data = {
          content: res.data,
          name: name
        };
        window.parent.postMessage(data, '*');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const total = ref(0);
const page = ref(1);
const size = ref(15);
onMounted(async () => {
  getListData();
});
interface Img {
  id: number;
  path: string;
}
const imgArr = ref<Img[]>([]);
const getListData = async (): Promise<any> => {
  const res = await getImglist({ page: page.value, limit: size.value });
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
