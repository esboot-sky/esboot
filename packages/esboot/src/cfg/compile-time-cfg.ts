import { resolve, join } from 'path';

const pkg = require('../../package.json');

export enum PROJECT_TYPE {
  SP = 'SP',
  MP = 'MP',
}

export enum PLATFORMS {
  MOBILE = 'mobile',
  PC = 'pc',
}

export enum PAGE_TYPE {
  native = 'native',
  browser = 'browser',
}

export default class CompileTimeCfg {
  load = () => {

  };
}
