import type { AddFunc } from '@/cfg/types';
import { DEFAULT_ANALYZE_PORT } from '@dz-web/esboot-common';
import { shellEnv } from '@dz-web/esboot-common/environment';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export const addBundleAnalyzerPlugin: AddFunc = async (cfg, webpackCfg) => {
  const { analyze, isDev } = cfg.config;

  if (!isDev && analyze) {
    webpackCfg.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: Number(shellEnv.get('ANALYZE_PORT')) || DEFAULT_ANALYZE_PORT,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'parsed',
      }),
    );
  }
};
