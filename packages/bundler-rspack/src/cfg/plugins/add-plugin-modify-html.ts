import type { Compilation, Compiler } from '@rspack/core';
import type { AddFunc } from '@/cfg/types';
import { injectHtml } from '@dz-web/esboot-bundler-common';
import { HtmlRspackPlugin } from '@rspack/core';

const pluginName = 'HtmlModifyPlugin';

export const addPluginModifyHtml: AddFunc = async (cfg, rspackCfg) => {
  rspackCfg.plugins.push({
    apply: (compiler: Compiler) => {
      compiler.hooks.compilation.tap(pluginName, (compilation: Compilation) => {
        const hooks = HtmlRspackPlugin.getCompilationHooks(compilation);

        hooks.beforeEmit.tap(pluginName, (data) => {
          const modifiedHtml = injectHtml(data.html, cfg, data.plugin.options.title || '');
          return {
            ...data,
            html: typeof modifiedHtml === 'string' ? modifiedHtml : data.html,
          };
        });
      });
    },
  });
};
