import { omit } from '@dz-web/esboot-common/lodash';
import CompileTimeCfg, { CompileTimeConfig } from './compile-time-cfg';
import UserOptionsC from './user-options';

import { Bundler } from '../bundler';

export default new (class Cfg {
  #userOptions: UserOptionsC;
  #compileTimeCfg: CompileTimeCfg;
  #bundler: Bundler | null;

  constructor() {
    this.#compileTimeCfg = new CompileTimeCfg();
    this.#userOptions = new UserOptionsC(this.#compileTimeCfg.config);
    this.#bundler = null;
  }

  get compileTimeCfg() {
    // TODO: type
    return this.#compileTimeCfg.config as Required<CompileTimeConfig>;
  }

  get userOptions() {
    return this.#userOptions.config;
  }

  get bundler() {
    return this.#bundler;
  }

  load() {
    this.#compileTimeCfg.load();
    this.#userOptions.load();

    if (this.userOptions.bundler) {
      this.#bundler = new this.userOptions.bundler({
        compileTimeCfg: this.compileTimeCfg,
        userOptions: omit(this.userOptions, 'bundler'),
      });
    }
  }
})();
