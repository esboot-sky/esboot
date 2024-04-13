declare interface Window {
  __router__?: any;
  /**
   * 页面覆盖自己的退出登录方法，请求失败时使用
   */
  __mobile_store__: any;
  __pc_store__: any;
  GLOBAL_CONFIG: {
    COMMON_SERVERS: any;
  };
  esboot_urlParams: Record<string, string>;
}
