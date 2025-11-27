import type { ConfigurationInstance } from '@dz-web/esboot';
import { isBoolean, isNumber } from '@dz-web/esboot-common/lodash';

type AddDefineRes = Record<string, unknown>;
export function addDefine(cfg: ConfigurationInstance): AddDefineRes {
  const { define = {} } = cfg.config;

  const customDefine: AddDefineRes = {};
  for (const key in define) {
    const value = define[key];
    if (isBoolean(value) || isNumber(value)) {
      customDefine[key] = value;
    }
    else {
      customDefine[key] = JSON.stringify(value);
    }
  }

  return {
    ...customDefine,
  };
}
