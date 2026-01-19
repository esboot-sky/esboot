import { listenReactQueryError } from '@/global-events';

// 监听react query错误
listenReactQueryError((friendlyMessage, error, meta) => {
  console.error('还未添加全局错误提示', friendlyMessage, error, meta);
});

// TODO: 监听请求失败错误, 通常不统一报错，而是在各个页面自己处理，否则有错误定制需求的页面会重复报错
// 或者使用react query管理请求，重试请求失败后，会统一处理报错，并且可以通过meta抑制错误提示
