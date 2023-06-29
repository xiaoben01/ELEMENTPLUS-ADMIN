import router from '@/router';
import tags from '@/store/modules/tags';
// 跳到最后一个标签
export function toLastTag(visitedTags: any, view?: any): void {
  const latestView = visitedTags.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath });
    } else {
      router.push('/');
    }
  }
}

// 关闭当前标签
export function closeSelectedTag(view: any): void {
  tags()
    .delTag(view)
    .then((res: any) => {
      toLastTag(res.visitedTags, view);
    });
}
