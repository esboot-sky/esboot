import { HtmlRspackPlugin } from '@rspack/core';
import type { Compilation, Compiler } from '@rspack/core';
import { injectHtml } from '@dz-web/esboot-bundler-common';
import type { AddFunc } from '@/cfg/types';

const pluginName = 'HtmlModifyPlugin';

export const addPluginModifyHtml: AddFunc = async (cfg, rspackCfg) => {
  rspackCfg.plugins.push({
    apply: (compiler: Compiler) => {
      compiler.hooks.compilation.tap(pluginName, (compilation: Compilation) => {
        const hooks = HtmlRspackPlugin.getCompilationHooks(compilation);

        // hooks.alterAssetTagGroups.tap(pluginName, (data, cb) => {
        //   // data.assetTags.scripts.unshift({
        //   //   tagName: 'script',
        //   //   voidTag: true,
        //   //   attributes: {
        //   //     defer: true,
        //   //     src: `${publicPath}config.js?v=${version}`,
        //   //   },
        //   // });

        //   if (true) {
        //     data.headTags.push({
        //       tagName: 'script',
        //       voidTag: false,
        //       attributes: {
        //         src: false,
        //         defer: true,
        //       },
        //       innerHTML:
        //         'const a = 1; console.log("This is an inline script");',
        //     });
        //   }

        //   cb(null, data);
        // });

        hooks.beforeEmit.tap(pluginName, (data) => {
          return {
            ...data,
            html: injectHtml(data.html, cfg, data.plugin.options.title || ''),
          };
        });
      });
    },
  });
};
