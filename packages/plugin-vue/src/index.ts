import type { Plugin } from '@dz-web/esboot';
import type { Options as VueJsxOptions } from '@vitejs/plugin-vue-jsx';
import type { VitePluginVueDevToolsOptions } from 'vite-plugin-vue-devtools';
import { PluginHooks } from '@dz-web/esboot';
import { isArray, omit } from '@dz-web/esboot-common/lodash';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

interface PluginVueOptions {
  vueDevToolsOptions?: VitePluginVueDevToolsOptions & { enable?: boolean };
  jsxOptions?: VueJsxOptions & { enable?: boolean };
}

export default (options: PluginVueOptions = {}): Plugin => {
  const {
    vueDevToolsOptions = { enable: true },
    jsxOptions = { enable: false },
  } = options;
  const vueDevToolsPlugin = vueDevToolsOptions.enable
    ? vueDevTools(omit(vueDevToolsOptions, 'enable'))
    : null;
  const vueJsxPlugin = jsxOptions.enable
    ? vueJsx(omit(jsxOptions, 'enable'))
    : null;

  return {
    key: 'plugin-vue',
    [PluginHooks.modifyConfig]: (cfg) => {
      cfg.svgrOptions!.plugins = cfg.svgrOptions!.plugins.filter((plugin: string) => plugin !== '@svgr/plugin-jsx');
      return cfg;
    },
    [PluginHooks.modifyBundlerConfig]: (
      _,
      bundlerConfig,
      bundlerName,
    ): void => {
      if (bundlerName === 'vite') {
        // Modify Plugin
        bundlerConfig.plugins = bundlerConfig.plugins.filter(
          (plugin: { name?: string } | { name?: string }[]) => {
            if (isArray(plugin)) {
              return plugin.some(
                (item: { name?: string }) =>
                  !item.name || !item.name.toLowerCase().includes('react'),
              );
            }
            return !plugin.name || !plugin.name.toLowerCase().includes('react');
          },
        );

        // Add manualChunks
        try {
          let { framework } = bundlerConfig.build!.rollupOptions!.output!.manualChunks;

          framework = framework.filter((chunk: string) => !chunk.startsWith('react'));

          bundlerConfig.build!.rollupOptions!.output!.manualChunks!.framework = [
            'vue',
            ...framework,
          ];
        }
        catch (error) {
          console.error(`[Plugin Vue] Failed to add manualChunks: ${error}`);
        }

        bundlerConfig.plugins.unshift(vue(), vueDevToolsPlugin, vueJsxPlugin);
      }
      else {
        throw new Error(
          `Plugin Vue is not supported for ${bundlerName} now, please use vite instead.`,
        );
      }
    },
  };
};
