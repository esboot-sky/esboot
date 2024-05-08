import UserCfg from './user-cfg';

export default new (class Cfg {
  userCfg: UserCfg;

  constructor() {
    this.userCfg = new UserCfg();
  }

  load() {
    this.userCfg.load();
  }
})();
