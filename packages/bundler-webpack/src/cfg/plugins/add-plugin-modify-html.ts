import type { Compilation, Compiler } from 'webpack';
import type { AddFunc } from '@/cfg/types';
import { injectHtml } from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const pluginName = 'HtmlModifyPlugin';

export const addPluginModifyHtml: AddFunc = async (cfg, webpackCfg) => {
  webpackCfg.plugins.push({
    apply: (compiler: Compiler) => {
      compiler.hooks.compilation.tap(pluginName, (compilation: Compilation) => {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);

        hooks.beforeEmit.tap(pluginName, (data) => {
          return {
            ...data,
            html: injectHtml(data.html, cfg, data.plugin?.options?.title || ''),
          };
        });
      });
    },
  });
};
