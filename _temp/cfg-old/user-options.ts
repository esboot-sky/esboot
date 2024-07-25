import { existsSync } from 'fs';
import { exit } from 'process';
import { isFunction, merge } from '@dz-web/esboot-common/lodash';
import { USER_CONFIG_FILE } from '@dz-web/esboot-common/constants';
import { error } from '@dz-web/esboot-common/helpers';

import { defaultUserOpts } from './default-user-opions';
import { CompileTimeConfig } from './compile-time-cfg';

import type { UserOptions } from './types';

export default class UserOptionsC {
  config: UserOptions = { bundler: null };

  constructor(private compileTimeConfig: CompileTimeConfig) {
    this.compileTimeConfig = compileTimeConfig;
  }

  getConfigFilePath = () => {
    return USER_CONFIG_FILE;
  };

  generateSPCfg = (): Partial<UserOptions> => {
    return {
      alias: {
        '@': 'src',
      },
    };
  };

  generateMPCfg = (): Partial<UserOptions> => {
    return {
      alias: {
        '@mobile-native': 'src/platforms/mobile/_native',
        '@mobile-browser': 'src/platforms/mobile/_browser',
        '@pc-native': 'src/platforms/pc/_native',
        '@pc-browser': 'src/platforms/pc/_browser',
        '@mobile': 'src/platforms/mobile',
        '@pc': 'src/platforms/pc',
        '@': 'src',
      },
    };
  };

  load = (reload = false) => {
    const filePath = this.getConfigFilePath();
    if (!existsSync(filePath)) {
      error(`User config file not found: ${filePath}`);
      exit(1);
    }

    if (reload) {
      delete require.cache[require.resolve(filePath)];
    }

    const { default: getCfg } = require(filePath);
    const cfg = isFunction(getCfg) ? getCfg(this.compileTimeConfig) : getCfg;

    const { isSP, isDev } = this.compileTimeConfig;
    const platformCfg = isSP ? this.generateSPCfg() : this.generateMPCfg();

    const options: UserOptions = merge(
      defaultUserOpts,
      platformCfg,
      { publicPath: isDev ? '/' : './' },
      cfg
    );

    this.config = options;
  };
}
