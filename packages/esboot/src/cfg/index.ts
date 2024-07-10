import { omit } from '@dz-web/esboot-common/lodash';
import CompileTimeCfg, { CompileTimeConfig } from './compile-time-cfg';
import UserCfg from './user-cfg';

import { Bundler } from '../bundler';

export default new (class Cfg {
  #userCfg: UserCfg;
  #compileTimeCfg: CompileTimeCfg;
  #bundler: Bundler | null;

  constructor() {
    this.#compileTimeCfg = new CompileTimeCfg();
    this.#userCfg = new UserCfg(this.#compileTimeCfg.config);
    this.#bundler = null;
  }

  get compileTimeCfg() {
    // TODO: type
    return this.#compileTimeCfg.config as Required<CompileTimeConfig>;
  }

  get userCfg() {
    return this.#userCfg.config;
  }

  get bundler() {
    return this.#bundler;
  }

  load() {
    this.#compileTimeCfg.load();
    this.#userCfg.load();

    if (this.userCfg.bundler) {
      this.#bundler = new this.userCfg.bundler({
        compileTimeCfg: this.compileTimeCfg,
        userCfg: omit(this.userCfg, 'bundler'),
      });
    }
  }
})();
