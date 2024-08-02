import type { AddFunc } from '@/cfg/types';

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
        analyzerPort: process.env.ANALYZE_PORT || 8888,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'parsed',
      })
    );
  }
};
