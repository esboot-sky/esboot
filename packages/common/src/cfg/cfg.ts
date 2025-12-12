import type { Configuration, ConfigurationForMP } from './types';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process, { exit } from 'node:process';
import { createJiti } from 'jiti';
import { DEFAULT_CONFIG_FOLDER, DEFAULT_SRC_FOLDER, Environment, getUserConfigFile, PAGE_TYPE, PLATFORMS } from '@/constants';

import { error } from '@/helpers';
import { getIpv4 } from '@/helpers/get-ipv4';

import { isFunction, isUndefined, merge, pick } from '@/lodash';
import pkg from '../../package.json' with { type: 'json' };
import { defaultCfg } from './default-cfg';

const jiti = createJiti(import.meta.url);

export class ESBootCfg<Options extends Configuration = Configuration> {
  #config: Options = defaultCfg as Options;

  get config(): Options {
    return this.#config;
  }

  #generateDefaultAlias = (): Record<string, string> => {
    return {
      '@': DEFAULT_SRC_FOLDER,
    };
  };

  #generateSPCfg = (): void => {
    const { configRootPath } = this.#config;

    const configJSPath = join(configRootPath, 'config.js');
    const staticPathList = [
      {
        from: configJSPath,
        to: './config.js',
      },
      {
        from: join(configRootPath, 'static'),
        to: './static',
      },
    ] satisfies Configuration['staticPathList'];
    this.#config.alias = {
      ...this.#generateDefaultAlias(),
      ...this.#config.alias,
    } satisfies Options['alias'];

    const cfg = {
      configJSPath,
      staticPathList,
    } satisfies Partial<Configuration>;

    Object.assign(this.#config, cfg);
  };

  #generateMPCfg = (): void => {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const platform = ESBOOT_PLATFORM;
    const pageType = ESBOOT_PAGE_TYPE;

    const { configRootPath, rootPath } = this.#config;

    if (NODE_ENV === Environment.prod) {
      process.env.BROWSERSLIST_ENV = `${platform}-${pageType}-${Environment.prod}`;
    }

    const configRootPathOfPlatfrom = join(configRootPath, platform);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${pageType}`,
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
    ] satisfies Configuration['staticPathList'];
    this.#config.alias = {
      ...this.#generateDefaultAlias(),
      '@mobile-native': `${DEFAULT_SRC_FOLDER}/platforms/mobile/_native`,
      '@mobile-browser': `${DEFAULT_SRC_FOLDER}/platforms/mobile/_browser`,
      '@pc-native': `${DEFAULT_SRC_FOLDER}/platforms/pc/_native`,
      '@pc-browser': `${DEFAULT_SRC_FOLDER}/platforms/pc/_browser`,
      '@mobile': `${DEFAULT_SRC_FOLDER}/platforms/mobile`,
      '@pc': `${DEFAULT_SRC_FOLDER}/platforms/pc`,
      ...this.#config.alias,
    } satisfies Configuration['alias'];

    const MPConfiguration = {
      platform: platform as PLATFORMS,
      pageType: pageType as PAGE_TYPE,
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      contentRootPath: join(rootPath, `./platforms/${platform}/_${pageType}`),
    } satisfies ConfigurationForMP;

    const cfg = {
      configJSPath,
      staticPathList,
      MPConfiguration,
    } satisfies Partial<Configuration>;

    Object.assign(this.#config, cfg);
  };

  loadEnv = (options: { cwd?: string } = {}): void => {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
      ESBOOT_IS_CI_BUILD = '0',
    } = process.env;

    if (options.cwd) {
      this.#config.cwd = options.cwd;
    }

    const { cwd } = this.#config;
    const isCIBuild = ESBOOT_IS_CI_BUILD === '1';
    const rootPath = resolve(cwd, DEFAULT_SRC_FOLDER);
    const configRootPath = resolve(cwd, DEFAULT_CONFIG_FOLDER);
    const ipv4 = getIpv4();
    const cfg = {
      cwd,
      ipv4,
      isCIBuild,
      rootPath,
      configRootPath,
      isDev: NODE_ENV === Environment.dev,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      entry: {},
      ...pick(pkg, ['version']),
    } satisfies Partial<Configuration>;
    Object.assign(this.#config, cfg);
  };

  loadConfigFile = async (): Promise<void> => {
    const filePath = getUserConfigFile(this.#config.cwd);

    if (!existsSync(filePath)) {
      error(`User config file not found: ${filePath}`);
      exit(1);
    }

    const getCfg = await jiti.import(filePath, { default: true });
    const userCfg = isFunction(getCfg) ? getCfg(this.#config) : getCfg;

    const { isDev } = this.#config;
    const defaultPublicPath = isDev ? '/' : './';
    const defaultDefine = {
      'process.env.VERSION': pkg.version,
      'process.env.NODE_ENV': process.env.NODE_ENV,
      'process.env.isMobile': this.#config.isMobile,
      'process.env.isBrowser': this.#config.isBrowser,
      'process.env.publicPath': userCfg.publicPath || defaultPublicPath,
    };

    this.#config = merge(
      this.#config,
      { publicPath: defaultPublicPath, define: defaultDefine },
      userCfg,
    );

    const { useLangJsonPicker } = userCfg;
    if (isUndefined(useLangJsonPicker)) {
      this.#config.useLangJsonPicker = !this.#config.isSP;
    }

    this.#config.isSP ? this.#generateSPCfg() : this.#generateMPCfg();
  };

  load = async (options: { cwd?: string } = {}): Promise<void> => {
    this.loadEnv(options);
    await this.loadConfigFile();
  };

  patch = (cfg: Partial<Configuration>): void => {
    this.#config = merge(this.#config, cfg);
  };
}
