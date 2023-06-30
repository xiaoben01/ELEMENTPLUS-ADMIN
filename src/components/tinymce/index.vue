<!--
 * @Description: tinymce富文本编辑器
 * @Author: xiaoben(xiaoben0527@qq.com)
-->
<template>
  <editor
    v-model="myValue"
    :init="init"
    :disabled="disabled"
    :id="tinymceId"
  ></editor>
</template>
<script setup lang="ts" name="Tinymce">
//JS部分
//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce';
import 'tinymce/skins/content/default/content.css';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom'; // 这里是个坑 一定要引入
//在TinyMce.vue中接着引入相关插件
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/code'; // 源码
import 'tinymce/plugins/fullscreen'; //全屏
//接下来定义编辑器所需要的插件数据
import { reactive, ref, onMounted, defineEmits, watch } from 'vue';
// 因为图片上传到七牛云，数据路径需要拼接，所以需要引入七牛云的接口
const centerDialogVisible = ref(false);
const emits = defineEmits(['get-content']);
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  value: {
    type: String,
    default: () => {
      return '';
    }
  },
  baseUrl: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  plugins: {
    type: [String, Array],
    default: 'lists table fullscreen'
  }, //必填
  toolbar: {
    type: [String, Array],
    default:
      'searchreplace bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | fontsizeselect styleselect | blockquote undo redo | removeformat subscript superscript | code codesample | meeting | hr bullist | numlist link | charmap preview anchor pagebreak insertdatetime | table | emoticons | forecolor backcolor | fullscreen'
  } //必填
});
//用于接收外部传递进来的富文本
const myValue = ref(props.value);
const tinymceId = ref(
  'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
);
//定义一个对象 init初始化
const init = reactive({
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: 'zh_CN', //语言
  skin_url: '/tinymce/skins/ui/oxide', // skin路径，具体路径看自己的项目
  height: 400, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  image_dimensions: false, //去除宽高属性
  plugins: props.plugins, //这里的数据是在props里面就定义好了的
  toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
  font_formats:
    'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: 'all',
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: 'file',
  promotion: false,
  content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  setup: function (Editor: any) {
    Editor.ui.registry.addButton('meeting', {
      text: '',
      icon: 'image',
      onAction: function () {
        Editor.windowManager.openUrl({
          title: '上传图片',
          name: 'upload',
          url: '#/img/' + props.name,
          width: 630,
          height: 540,
          onClose: function () {
            // 在这里执行您想要的操作
            console.log('窗口已关闭');
          }
        });
        centerDialogVisible.value = true;
      }
    });
  }
});
//监听外部传递进来的的数据变化
watch(
  () => props.value,
  () => {
    myValue.value = props.value;
    emits('get-content', myValue.value);
  }
);
//监听富文本中的数据变化
watch(
  () => myValue.value,
  () => {
    emits('get-content', myValue.value);
  }
);
//在onMounted中初始化编辑器
onMounted(async () => {
  tinymce.init({});
});
// 获取七牛云地址
const handle = (event: any): void => {
  // 防止同一页面引入多个编辑器时，出现多次执行的情况
  if (props.name === event.data.name) {
    window.removeEventListener('message', handle);
    // 接收从子窗口发送的消息
    const data = event.data.content;
    // 执行相关操作
    data.forEach((v: { path: any }) => {
      window.tinymce.activeEditor.insertContent(
        `<img class="wscnph" src="` + `${v.path}" >`
      );
    });
    // 关闭弹窗
    window.tinymce.get(tinymceId.value).windowManager.close();
  }
};
window.addEventListener('message', handle);
</script>

<style lang="scss" scoped>
.editor-upload-btn {
  display: inline-block;
}
</style>
