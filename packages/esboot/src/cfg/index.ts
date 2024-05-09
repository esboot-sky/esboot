import CompileTimeCfg, { CompileTimeConfig } from './compile-time-cfg';
import UserCfg from './user-cfg';

export default new (class Cfg {
  #userCfg: UserCfg;
  #compileTimeCfg: CompileTimeCfg;

  constructor() {
    this.#userCfg = new UserCfg();
    this.#compileTimeCfg = new CompileTimeCfg();
  }

  get compileTimeCfg() {
    // TODO: type
    return this.#compileTimeCfg.config as Required<CompileTimeConfig>;
  }

  get userCfg() {
    return this.#userCfg.config;
  }

  load() {
    this.#compileTimeCfg.load();
    this.#userCfg.load();
  }
})();
