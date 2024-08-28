import type { AddFunc } from '@/cfg/types';
import { DEFAULT_ANALYZE_PORT } from '@dz-web/esboot-common';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

export const addBundleAnalyzerPlugin: AddFunc = async function (
  cfg,
  webpackCfg
) {
  const { analyze, isDev } = cfg.config;

  if (!isDev && analyze) {
    webpackCfg.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: process.env.ANALYZE_PORT || DEFAULT_ANALYZE_PORT,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'parsed',
      })
    );
  }
};
