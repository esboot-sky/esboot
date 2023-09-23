import { resolve, join } from 'path';
import address from 'address';
import { pick, merge } from 'lodash';

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
}

export default new (class CCompileTimeConfig {
  // for better type
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
  };

  init = () => {
    const {
      NODE_ENV,
      ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const ipv4 = address.ip();

    const rootPath = resolve(process.cwd(), './src');
    const configRootPath = resolve(process.cwd(), `./config`);

    const common = {
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

    // Single Platform Config
    if (ESBOOT_PROJECT_TYPE === PROJECT_TYPE.SP) {
      Object.assign(this.config, {
        contentRootPath: rootPath,
        isSP: true,
        configRootPathOfPlatfrom: configRootPath,
        configRootPathOfPageType: configRootPath,
        configJSPath: `${configRootPath}/config.js`,
        ...common,
      } satisfies CompileTimeConfig);

      return;
    }

    // Multi Platform Config
    const configRootPathOfPlatfrom = join(configRootPath, ESBOOT_PLATFORM);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${ESBOOT_PAGE_TYPE}`
    );

    if (NODE_ENV === 'production') {
      process.env.BROWSERSLIST_ENV = `${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}-production`;
    }

    Object.assign(this.config, {
      isSP: false,
      contentRootPath: join(
        rootPath,
        `./platforms/${ESBOOT_PLATFORM}/_${ESBOOT_PAGE_TYPE}`
      ),
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      configJSPath: `${configRootPathOfPageType}/config.js`,
      ...common,
    } satisfies CompileTimeConfig);
  };
})();
