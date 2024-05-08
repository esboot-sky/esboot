import CompileTimeCfg from './compile-time-cfg';
import UserCfg from './user-cfg';

export default new (class Cfg {
  userCfg: UserCfg;
  compileTimeCfg: CompileTimeCfg;

  constructor() {
    this.userCfg = new UserCfg();
    this.compileTimeCfg = new CompileTimeCfg();
  }

  load() {
    this.compileTimeCfg.load();
    this.userCfg.load();
  }
})();
