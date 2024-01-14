import esbootConfig from '@@/config';

export const addDefine = (): Record<string, string> => {
  const { version } = esbootConfig.compileTimeConfig;
  const { define = {} } = esbootConfig.userOpts;

  const customDefine: Record<string, string> = {};
  for (const key in define) {
    customDefine[key] = JSON.stringify(define[key]);
  }

  return {
    'process.env.VERSION': JSON.stringify(version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    ...customDefine,
  };
};
