import { DEFAULT_DEVTOOL } from '@@/constants';

export const addDevtool = async (applyOpts: any) => {
  const {
    chainedConfig,
    isDev,
    userOpts: { sourceMap },
  } = applyOpts;

  chainedConfig

  
  if (sourceMap) {
    chainedConfig.devtool('source-map');
    return;
  }

  if (isDev) {
    chainedConfig.devtool(DEFAULT_DEVTOOL);
  }
};
