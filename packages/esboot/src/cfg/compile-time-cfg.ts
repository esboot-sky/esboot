import { resolve, join } from 'path';
import { pick } from '@dz-web/esboot-common/radash';

import { ip } from 'address';

const pkg = require('../../package.json');

export enum PROJECT_TYPE {
  SP = 'SP',
  MP = 'MP',
}

export enum PLATFORMS {
  MOBILE = 'mobile',
  PC = 'pc',
}

export enum PAGE_TYPE {
  native = 'native',
  browser = 'browser',
}

export interface CompileTimeConfig {
  projectType: PROJECT_TYPE;
  pageType: PAGE_TYPE;
  platform: PLATFORMS;
  isMobile: boolean;
  isSP: boolean;
  isBrowser: boolean;
  rootPath: string;
  contentRootPath: string;
  configRootPath: string;
  configRootPathOfPlatfrom: string;
  configRootPathOfPageType: string;
  configJSPath: string;
  ipv4: string;
  version: string;
  entry: Record<string, string>[];
  staticPathList: ObjectPattern[];
}

export default class CompileTimeCfg {
  config: CompileTimeConfig = {
    projectType: PROJECT_TYPE.MP,
    pageType: PAGE_TYPE.browser,
    platform: PLATFORMS.PC,
    isMobile: false,
    isSP: false,
    isBrowser: true,
    rootPath: '',
    configRootPath: '',
    contentRootPath: '',
    configRootPathOfPlatfrom: '',
    configRootPathOfPageType: '',
    configJSPath: '',
    ipv4: 'localhost',
    version: '',
    entry: [],
    staticPathList: [],
  };

  generateSPCfg = () => {
    const { configRootPath, rootPath } = this.config;

    const configJSPath = `${configRootPath}/config.js`;
    const staticPathList = [
      {
        from: configJSPath as string,
        to: './config.js',
      },
      {
        from: `${configRootPath}/static`,
        to: './static',
      },
    ] satisfies ObjectPattern[];

    const spConfig = {
      contentRootPath: rootPath,
      isSP: true,
      configRootPathOfPlatfrom: configRootPath,
      configRootPathOfPageType: configRootPath,
      configJSPath,
      staticPathList,
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, spConfig);
    return;
  };

  load = () => {
    const {
      NODE_ENV,
      ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;

    const rootPath = resolve(process.cwd(), './src');
    const configRootPath = resolve(process.cwd(), `./config`);

    const ipv4 = ip();

    const commonCfg = {
      ipv4,
      rootPath,
      configRootPath,
      projectType: ESBOOT_PROJECT_TYPE as PROJECT_TYPE,
      pageType: ESBOOT_PAGE_TYPE as PAGE_TYPE,
      platform: ESBOOT_PLATFORM as PLATFORMS,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      entry: [],
      ...pick(pkg, ['version']),
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, commonCfg);

    if (ESBOOT_PROJECT_TYPE === PROJECT_TYPE.SP) {
      this.generateSPCfg();

      console.log(this.config, '<-- this.config');
      return;
    }
  };
}
