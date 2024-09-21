import type { ConfigurationInstance } from '@dz-web/esboot';

type AddDefineRes = Record<string, string>;
export const addDefine = (cfg: ConfigurationInstance): AddDefineRes => {
  const { version, define = {} } = cfg.config;

  const customDefine: AddDefineRes = {};
  for (const key in define) {
    customDefine[key] = JSON.stringify(define[key]);
  }

  return {
    'process.env.VERSION': JSON.stringify(version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    ...customDefine,
  };
};



