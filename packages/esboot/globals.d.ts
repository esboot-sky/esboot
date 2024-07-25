import {
  Environment,
  PROJECT_TYPE,
  PAGE_TYPE,
  PLATFORMS,
} from '@dz-web/esboot-common/constants';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ESBOOT_CONTENT_PATH: string;
      ESBOOT_PROJECT_TYPE: PROJECT_TYPE;
      ESBOOT_PLATFORM: PLATFORMS;
      ESBOOT_PAGE_TYPE: PAGE_TYPE;
      ESBOOT_CONTENT_PATTERN: string;
      NODE_ENV: Environment;
    }
  }
}

export {};
