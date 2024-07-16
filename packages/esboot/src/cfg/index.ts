import { omit } from '@dz-web/esboot-common/lodash';
import CompileTimeCfg, { CompileTimeConfig } from './compile-time-cfg';
import UserOptionsC from './user-options';
import { PROJECT_TYPE } from './types';

import { Bundler } from '../bundler';

import type { Configuration } from './types';

export default new (class Cfg {
  #config: Configuration | null;

  load = () => {
    const { NODE_ENV, ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP } = process.env;
    const { cwd } = this.#config;

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
      isDev: NODE_ENV === Environment.dev,
      entry: {},
      ...pick(pkg, ['version']),
    } satisfies Partial<CompileTimeConfig>;

    Object.assign(this.config, cfg);

    if (cfg.isSP) {
      this.generateSPCfg();

      return;
    }

    this.generateMPCfg();
  };
})();
