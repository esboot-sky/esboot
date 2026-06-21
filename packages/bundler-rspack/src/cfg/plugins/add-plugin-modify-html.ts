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

        hooks.beforeEmit.tapPromise(pluginName, async (data) => {
          const entryName = data.plugin?.options?.chunks?.[0] || '';
          let modifiedHtml = await injectHtml(data.html, cfg, data.plugin.options.title || '');
          if (entryName && typeof modifiedHtml === 'string') {
            modifiedHtml = modifiedHtml.replace('<head>', `<head><script>window.__ESBOOT_ENTRY_NAME__ = "${entryName}";</script>`);
          }
          return {
            ...data,
            html: typeof modifiedHtml === 'string' ? modifiedHtml : data.html,
          };
        });
      });
    },
  });
};
