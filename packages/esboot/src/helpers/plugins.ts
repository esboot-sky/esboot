import esbootConfig from '@@/config';
import type { Plugin } from '@@/config/plugin';

export const invokeEachPlugin = (cb: (plugin: Plugin) => void) => {
  const { plugins = [] } = esbootConfig.userOpts;

  plugins.forEach((plugin) => {
    cb(plugin);
  });
};
