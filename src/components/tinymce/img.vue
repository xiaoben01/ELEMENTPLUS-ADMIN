<!--
 * @Description: 上传组件二次封装
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <div class="container">
    <el-container>
      <el-header height="40px">
        <el-upload :headers="headers" :action="upload_path" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :data="upParma">
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
        <Pagination :total="listQuery.total" v-model:page="listQuery.page" v-model:size="listQuery.pageSize" :layout="'prev, pager, next'" @pagination="getListData" />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
/** 引用  */
import { onMounted, computed, ref, reactive } from 'vue';
import { UploadRawFile, UploadProps, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import service from '@/common/request/http';
import { storage } from '@/common/utils';
import setting from '@/common/setting';
/** 类型  */
interface Img {
  id: number;
  path: string;
}
/**  变量 */
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
const headers = ref({ 'X-Token': '' });
const limit = computed(() => props.limit);
const imgIndex = ref<number[]>([]);
const listQuery = reactive({
  total: 0,
  page: 1,
  pageSize: 15
});
const imgArr = ref<Img[]>([]);
/**  方法 */
onMounted(async () => {
  getListData();
  if (upload_path.indexOf('http') !== -1 && upload_path.indexOf('https') !== -1) {
    getQiniuToken();
  }
});
const handleSuccess: UploadProps['onSuccess'] = async (response) => {
  if (upload_path.indexOf('http') !== -1 && upload_path.indexOf('https') !== -1) {
    await service.post(`file/upload`, {
      path: response.key
    });
  }
  listQuery.page = 1;
  getListData();
};
const handleBeforeUpload = function (file: UploadRawFile): boolean {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning('上传图片不能大于2M');
    return false;
  }
  if (['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) === -1) {
    ElMessage.warning('请上传正确的图片格式');
    return false;
  }
  //往headers中添加token
  headers.value['X-Token'] = storage.get(setting.tokenName, 'session');
  return true;
};
const emptying = (): void => {
  imgIndex.value = [];
};
const del = async (): Promise<any> => {
  if (imgIndex.value.length === 0) {
    ElMessage.warning('请选择要删除的图片');
    return false;
  }
  const ids = imgIndex.value.join(',');
  return new Promise((resolve, reject) => {
    service
      .delete(`file/delImg/${ids}`)
      .then((resp: any) => {
        if (resp.code === 200) {
          ElMessage.success(resp.msg);
          imgIndex.value = [];
          listQuery.page = 1;
          getListData();
        } else {
          ElMessage.warning('请求异常');
        }
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const useImg = (): void => {
  if (imgIndex.value.length === 0) {
    ElMessage.warning('请选择要使用的图片');
    return;
  }
  const ids = imgIndex.value.join(',');
  service
    .get(`file/getImgByIds/${ids}`)
    .then((res: any) => {
      if (res.code === 200) {
        // 获取选中的值
        const data = {
          content: res.data,
          name: name
        };
        // 将对象传递给父组件
        window.parent.postMessage(data, '*');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const getQiniuToken = async (): Promise<any> => {
  const res = await service.get(`file/getQiniuToken`);
  upParma.value.token = res.data;
};
const getListData = async (): Promise<any> => {
  const res = await service.get(`file/getList`, {
    params: listQuery
  });
  imgArr.value = res.data.list;
  listQuery.total = res.data.total;
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
</style>
