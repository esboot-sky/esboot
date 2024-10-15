import type {
  Environment,
  PAGE_TYPE,
  PLATFORMS,
} from '@dz-web/esboot-common/constants';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ESBOOT_CONTENT_PATH: string;
      ESBOOT_PLATFORM: PLATFORMS;
      ESBOOT_PAGE_TYPE: PAGE_TYPE;
      ESBOOT_CONTENT_PATTERN: string;
      ESBOOT_IS_CI_BUILD: string;
      NODE_ENV: Environment;
    }
  }
}
