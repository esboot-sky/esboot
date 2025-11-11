declare interface Window {
  eruda: {
    init: () => void;
  };
  GLOBAL_CONFIG: {
    debug: boolean;
    COMMON_SERVERS: Record<string, string>;
  };
}
