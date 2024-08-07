/// <reference types="@dz-web/esboot-lint" />

import {
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
      NODE_ENV: Environment;
    }
  }
}

export {};
