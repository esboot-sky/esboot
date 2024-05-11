import CompileTimeCfg, { CompileTimeConfig } from './compile-time-cfg';
import UserCfg from './user-cfg';

export default new (class Cfg {
  #userCfg: UserCfg;
  #compileTimeCfg: CompileTimeCfg;

  constructor() {
    this.#compileTimeCfg = new CompileTimeCfg();
    this.#userCfg = new UserCfg(this.#compileTimeCfg.config);
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
