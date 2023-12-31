/*
 * @Description: 应用默认配置
 * @Author: xiaoben(xiaoben0527@qq.com)
 */
export default {
  // 网站标题
  title: import.meta.env.VITE_APP_TITLE,
  // 网站LOGO
  logo: import.meta.env.VITE_BUILD_LOGO,
  // 用户头像
  avatar: import.meta.env.VITE_BUILD_LOGO,
  // 是否显示LOGO
  showLogo: true,
  // 是否显示面包屑
  showBreadcrumb: true,
  // 是否显示标签栏
  showTags: true,
  // 标签栏是否显示图标
  showTagsIcon: true,
  // 是否显示进度条
  showProgress: true,
  // 是否固定Header
  fixedHeader: true,
  // 是否显示刷新按钮
  showRefresh: true,
  // 是否显示用户名与角色
  showUserInfo: true,
  // 主题：空值为默认，
  theme: '',
  // 可用主题列表: spring,summer,autumn,winter,dark
  themeList: [
    {
      label: '默认',
      value: ''
    },
    {
      label: '夜间模式(暗)',
      value: 'dark'
    }
  ],
  // 响应式宽度
  width: 768,
  // token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  // 不经过校验的路由(路由名称，不是路径)，在免登录名单，直接进入
  routerWhiteList: ['/login'],
  // token名称
  tokenName: 'token',
  // 存储位置: 本地存储(永久)localStorage | 会话存储(临时)sessionStorage
  storage: 'localStorage',
  // storage过期时间(分钟) 0 为不设过期时间
  storageExpires: 180,
  // 表单尺寸
  formSize: 'default',
  // 网络请求
  request: {
    // 网络请求是否开启Token
    token: true,
    // 网络请求是否显示loading, 注：loading 为 true 时 showProgress 的设置则无效
    loading: false,
    // 网络请求超时(秒)
    timeout: 1000 * 60,
    // 允许发送cookie数据
    withCredentials: true
  }
};
