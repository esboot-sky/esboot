import { DEFAULT_DEVTOOL } from '@@/constants';

export const addDevtool = async (applyOpts: any) => {
  const {
    isDev,
    config,
    userOpts: { sourcemap },
  } = applyOpts;

  if (sourcemap) {
    config.devtool = 'source-map';
    return;
  }

  if (isDev) {
    config.devtool = DEFAULT_DEVTOOL;
  }
};
