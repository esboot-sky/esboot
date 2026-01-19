declare interface Window {
  __router__?: any;
  GLOBAL_CONFIG: {
    debug: boolean;
    COMMON_SERVERS: any;
  };
  esboot_urlParams: Record<string, string>;
}
