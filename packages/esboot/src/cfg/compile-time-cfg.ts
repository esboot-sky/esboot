import { resolve, join } from 'path';
import { pick } from '@dz-web/esboot-common/radash';
import { Environment } from '@dz-web/esboot-common/constants';

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

export interface CompileTimeConfigForMP {
  pageType: PAGE_TYPE;
  platform: PLATFORMS;
  isMobile: boolean;
  isBrowser: boolean;
  configRootPathOfPlatfrom: string;
  configRootPathOfPageType: string;
}

export interface CompileTimeConfig extends Partial<CompileTimeConfigForMP> {
  projectType: PROJECT_TYPE;
  isSP: boolean;
  rootPath: string;
  contentRootPath: string;
  configRootPath: string;
  configJSPath: string;
  ipv4: string;
  version: string;
  cwd: string;
  entry: Record<string, string>[];
  staticPathList: any[];
}

export default class CompileTimeCfg {
  config: CompileTimeConfig = {
    projectType: PROJECT_TYPE.MP,
    isSP: false,
    rootPath: '',
    configRootPath: '',
    contentRootPath: '',
    configJSPath: '',
    ipv4: 'localhost',
    version: '',
    entry: [],
    cwd: process.cwd(),
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
    ] satisfies any[];

    const cfg = {
      contentRootPath: rootPath,
      configJSPath,
      staticPathList,
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, cfg);
  };

  generateMPCfg = () => {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const platform = ESBOOT_PLATFORM as PLATFORMS;
    const pageType = ESBOOT_PAGE_TYPE as PAGE_TYPE;

    const { configRootPath, rootPath } = this.config;

    if (NODE_ENV === Environment.prod) {
      process.env.BROWSERSLIST_ENV = `${platform}-${pageType}-${Environment.prod}`;
    }

    const configRootPathOfPlatfrom = join(configRootPath, platform);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${pageType}`
    );

    const configJSPath = `${configRootPathOfPageType}/config.js`;
    const staticPathList = [
      {
        from: configJSPath,
        to: './config.js',
      },
      {
        from: `${configRootPathOfPageType}/static`,
        to: './static',
      },
      {
        from: `${configRootPathOfPlatfrom}/static`,
        to: './static',
      },
      {
        from: `${configRootPath}/static`,
        to: './static',
      },
    ] satisfies any[];

    const cfg = {
      contentRootPath: join(rootPath, `./platforms/${platform}/_${pageType}`),
      platform,
      pageType,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      configJSPath,
      staticPathList,
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, cfg);
  };

  load = () => {
    const { ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP } = process.env;
    const { cwd } = this.config;

    const rootPath = resolve(cwd, './src');
    const configRootPath = resolve(cwd, `./config`);

    const ipv4 = ip();

    const cfg = {
      cwd,
      ipv4,
      rootPath,
      configRootPath,
      projectType: ESBOOT_PROJECT_TYPE as PROJECT_TYPE,
      isSP: ESBOOT_PROJECT_TYPE === PROJECT_TYPE.SP,
      entry: [],
      ...pick(pkg, ['version']),
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, cfg);

    if (cfg.isSP) {
      this.generateSPCfg();

      return;
    }

    this.generateMPCfg();
  };
}
