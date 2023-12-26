import { DEFAULT_DEVTOOL } from '@@/constants';

export const addDevtool = async (applyOpts: any) => {
  const {
    isDev,
    config,
    userOpts: { sourceMap },
  } = applyOpts;

  if (sourceMap) {
    config.devtool = 'source-map';
    return;
  }

  if (isDev) {
    config.devtool = DEFAULT_DEVTOOL;
  }
};
