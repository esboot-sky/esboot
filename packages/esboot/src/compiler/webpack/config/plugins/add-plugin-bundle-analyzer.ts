// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { ApplyOpts } from '../types';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

export const addBundleAnalyzerPlugin = async (applyOpts: ApplyOpts) => {
  const {
    config,
    userOpts: { analyze },
    isDev,
  } = applyOpts;

  if (!isDev && analyze) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: process.env.ANALYZE_PORT || 8888,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'parsed',
        ...analyze,
      })
    );
  }
};
