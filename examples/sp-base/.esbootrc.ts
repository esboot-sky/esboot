import { defineConfig, type Configuration } from '@dz-web/esboot';
import { BundlerVite, type BundlerViteOptions  } from '@dz-web/esboot-bundler-vite';
// import { BundlerWebpack, type BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';

export default defineConfig<BundlerViteOptions>({
  bundler: BundlerVite,
  isSP: true,
  // bundler: BundlerWebpack,
  bundlerOptions: {  },
  sourceMap: false,
  alias: {
    '@@': 'src',
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
