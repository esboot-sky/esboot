import { defineConfig, type Configuration } from '@dz-web/esboot';
import { BundlerVite as Bundler, type BundlerViteOptions as BundlerOptions  } from '@dz-web/esboot-bundler-vite';
// import {
//   BundlerWebpack as Bundler,
//   CodeSplittingType,
//   type BundlerWebpackOptions as BundlerOptions,
// } from '@dz-web/esboot-bundler-webpack';

export default defineConfig<BundlerOptions>({
  bundler: Bundler,
  isSP: true,
  bundlerOptions: {},
  // bundlerOptions: {
  //   codeSplitting: {
  //     jsStrategy: CodeSplittingType.granularChunks,
  //   },
  // },
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    http2: false,
  },
  // analyze: true,
  // extraBabelIncludes: [
  //   /filter-obj/i,
  //   /immer/i,
  //   /zustand/i,
  //   /query-string/i,
  //   /react-intl/i,
  //   /d3-/i,
  //   /@tanstack/i,
  //   /@react-spring/i,
  //   /@floating-ui/i,
  // ],
});
