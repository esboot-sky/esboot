import { resolve, join } from 'path';
import address from 'address';
import { pick } from 'lodash';

const pkg = require('../../package.json');

enum PLATFORMS {
  MOBILE = 'mobile',
  PC = 'pc',
}

enum PAGE_TYPE {
  native = 'native',
  browser = 'browser',
}

export default new (class CompileTimeConfig {
  pageType: PAGE_TYPE = PAGE_TYPE.browser;
  platform: PLATFORMS = PLATFORMS.PC;
  isMobile = false;
  isBrowser = true;
  rootPath = '';
  configRootPath = '';
  configRootPathOfPlatfrom = '';
  configRootPathOfPageType = '';
  configJSPath = '';
  ipv4 = 'localhost';

  init() {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const ipv4 = address.ip();

    const configRootPath = resolve(process.cwd(), `./config`);
    const configRootPathOfPlatfrom = join(configRootPath, ESBOOT_PLATFORM);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${ESBOOT_PAGE_TYPE}`
    );

    if (NODE_ENV === 'production') {
      process.env.BROWSERSLIST_ENV = `${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}-production`;
    }

    Object.assign(this, {
      ipv4,
      pageType: ESBOOT_PAGE_TYPE,
      platform: ESBOOT_PLATFORM,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      rootPath: resolve(process.cwd(), './src'),
      configRootPath,
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      configJSPath: `${configRootPathOfPageType}/config.js`,
      ...pick(pkg, ['version']),
    });
  }
})();
