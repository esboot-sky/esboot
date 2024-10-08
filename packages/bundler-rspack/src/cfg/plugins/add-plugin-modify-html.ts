import { join } from 'node:path';
import { HtmlRspackPlugin } from '@rspack/core';
import type { Compilation, Compiler } from '@rspack/core';
import type { AddFunc } from '@/cfg/types';

const pluginName = 'HtmlModifyPlugin';
const getVersion = (cwd: string) => {
  const pkg = require(join(cwd, 'package.json'));
  return pkg.version;
};

export const addPluginModifyHtml: AddFunc = async (cfg, rspackCfg) => {
  const { isBrowser, ipv4, publicPath, isDev, cwd } = cfg.config;

  const version = process.env.BUILD_VERSION || getVersion(cwd);
  const isInjectBridgeMock = !isBrowser && isDev;

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
          const importCfgScript = `<script src="${publicPath}config.js?v=${version}">
              <\/script>`;
          const injectBridgeMockScript = isInjectBridgeMock
            ? `<script>
              window.brigeMockHost = "http://${process.env.BRIDGE_MOCK_HOST || ipv4}";
              window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3000};
              <\/script>`
            : '';
          data.html = data.html
            .replace(
              '<body>',
              `<body>${importCfgScript}${injectBridgeMockScript}`
            )
            .replace('<title>', `<title>${data.plugin.options.title}`);

          return data;
        });
      });
    },
  });
};
