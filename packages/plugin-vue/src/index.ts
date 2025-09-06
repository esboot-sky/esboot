import type { Plugin } from '@dz-web/esboot';
import { PluginHooks } from '@dz-web/esboot';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

interface PluginVueOptions {
  useVueDevTools?: boolean;
  jsx?: boolean;
}

export default (options: PluginVueOptions = {}): Plugin => {
  const { useVueDevTools = true, jsx = false } = options;
  const vueDevToolsPlugin = useVueDevTools ? vueDevTools() : null;
  const vueJsxPlugin = jsx ? vueJsx() : null;

  return {
    key: 'plugin-vue',
    [PluginHooks.modifyConfig]: (cfg) => {
      cfg.svgrOptions.plugins = ['@svgr/plugin-svgo'];
      return cfg;
    },
    [PluginHooks.modifyBundlerConfig]: (_, bundlerConfig, bundlerName): void => {
      if (bundlerName === 'vite') {
        bundlerConfig.plugins.shift();
        bundlerConfig.plugins.unshift(vue(), vueDevToolsPlugin, vueJsxPlugin);
      }
      else {
        throw new Error(`Plugin Vue is not supported for ${bundlerName} now, please use vite instead.`);
      }
    },
  };
};
