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

  const version = getVersion(cwd);
  const isInjectBridgeMock = !isBrowser && isDev;

  rspackCfg.plugins.push(
    {
      apply: (compiler: Compiler) => {
        compiler.hooks.compilation.tap(
          pluginName,
          (compilation: Compilation) => {
            const hooks = HtmlRspackPlugin.getCompilationHooks(compilation);

            hooks.alterAssetTagGroups.tap(pluginName, (data) => {
              // data.assetTags.scripts.unshift({
              //   tagName: 'script',
              //   voidTag: true,
              //   attributes: {
              //     defer: true,
              //     src: `${publicPath}config.js?v=${version}`,
              //   },
              // });

              if (true) {
                data.headTags.unshift({
                  tagName: 'script',
                  voidTag: false,
                  attributes: {
                    // src: 'http://127.0.0.1:3000/bridge.js',
                    defer: true,
                  },
                  innerHTML:
                    'const a = 1; console.log("This is an inline script");',
                });
              }
              return data;
            });

            // hooks.alterAssetTagGroups.tapPromise(pluginName, async (data) => {
            //   console.log('alterAssetTagGroups');
            //   console.log(data, 'data');

            //   return data;
            // });

            hooks.afterTemplateExecution.tap(
              pluginName,
              (data) => {
                console.log('afterTemplateExecution');
                console.log(data, 'data32');

                return data;
              }
            );
          }
        );
      },
    }
    // @ts-ignore
    // HtmlModifyPlugin({
    //   position: 'start',
    //   content: `
    //   <script src="${publicPath}config.js?v=${
    //     // jenkins version
    //     process.env.BUILD_VERSION || getVersion(cwd)
    //   }">
    //   <\/script>

    //   ${
    //     isInjectBridgeMock
    //       ? `<script>
    //     window.brigeMockHost = "http://${process.env.BRIDGE_MOCK_HOST || ipv4}";
    //     window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3000};
    //     <\/script>`
    //       : ''
    //   }
    //   `,
    // })
  );
};
