import type { Plugin } from '@dz-web/esboot';
import type { Options as VueJsxOptions } from '@vitejs/plugin-vue-jsx';
import type { VitePluginVueDevToolsOptions } from 'vite-plugin-vue-devtools';
import { PluginHooks } from '@dz-web/esboot';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

interface PluginVueOptions {
  vueDevToolsOptions?: VitePluginVueDevToolsOptions & { enable?: boolean };
  jsxOptions?: VueJsxOptions & { enable?: boolean };
}

export default (options: PluginVueOptions = {}): Plugin => {
  return {
    name: 'plugin-vue',
    enforce: 'pre',
    [PluginHooks.modifyConfig]: (cfg) => {
      const config = cfg as typeof cfg & {
        bundlerOptions?: Record<string, any>;
      };
      const currentPlugins = cfg.svgrOptions.plugins || [];
      const bundlerOptions = (config.bundlerOptions || {}) as Record<string, any>;
      const {
        vueDevToolsOptions = { enable: true },
        jsxOptions = { enable: false },
      } = options;

      cfg.svgrOptions!.plugins = ['@svgr/plugin-svgo', ...currentPlugins];
      config.bundlerOptions = {
        ...bundlerOptions,
        frameworkProvider: {
          ...bundlerOptions.frameworkProvider,
          useReactStyleNamePlugin: false,
          transformFrameworkBundles: (frameworkBundles: string[]) => [
            'vue',
            ...frameworkBundles.filter(
              chunk => chunk !== 'vue' && !chunk.startsWith('react'),
            ),
          ],
          getPlugins: ({ target }: { target: 'vite' | 'vitest' }) => {
            const plugins = [vue()] as any[];

            if (target === 'vite' && vueDevToolsOptions.enable) {
              const { enable: _enable, ...vueDevToolsPluginOptions } = vueDevToolsOptions;
              plugins.push(vueDevTools(vueDevToolsPluginOptions));
            }

            if (jsxOptions.enable) {
              const { enable: _enable, ...vueJsxPluginOptions } = jsxOptions;
              plugins.push(vueJsx(vueJsxPluginOptions));
            }

            return plugins;
          },
        },
      } as any;
      return cfg;
    },
  };
};
