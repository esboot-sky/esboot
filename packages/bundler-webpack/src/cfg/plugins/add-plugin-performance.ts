import type { Compiler } from 'webpack';
import type { AddFunc } from '@/cfg/types';
import { info } from '@dz-web/esboot-common/helpers';

const pluginName = 'ESBootPerformancePlugin';

export const addPerformancePlugin: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, isCIBuild } = cfg.config;

  if (!isDev || isCIBuild) {
    return;
  }

  webpackCfg.plugins.push({
    apply: (compiler: Compiler) => {
      let startTime = Date.now();
      let hasCompiled = false;

      compiler.hooks.invalid.tap(pluginName, () => {
        startTime = Date.now();
      });

      compiler.hooks.done.tap(pluginName, () => {
        const duration = Date.now() - startTime;

        if (!hasCompiled) {
          hasCompiled = true;
          info(`Initial compile time: ${duration}ms`);
          return;
        }

        info(`Rebuild time: ${duration}ms`);
      });
    },
  });
};
