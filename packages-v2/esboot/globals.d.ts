declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ESBOOT_CONTENT_PATH: string;
      ESBOOT_PROJECT_TYPE: string;
      ESBOOT_PLATFORM: string;
      ESBOOT_PAGE_TYPE: string;
      ESBOOT_CONTENT_PATTERN: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
