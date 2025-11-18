import type { ConfigurationInstance } from '@dz-web/esboot';

type AddDefineRes = Record<string, unknown>;
export function addDefine(cfg: ConfigurationInstance): AddDefineRes {
  const { define = {} } = cfg.config;

  const customDefine: AddDefineRes = {};
  for (const key in define) {
    customDefine[key] = JSON.stringify(define[key]);
  }

  return {
    ...customDefine,
  };
}
