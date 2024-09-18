import { defineConfig } from '@dz-web/esboot';
import {
  BundlerWebpack as Bundler,
  type BundlerWebpackOptions as BundlerOptions,
} from '@dz-web/esboot-bundler-webpack';

// import { BundlerVite as Bundler, type BundlerViteOptions as BundlerOptions  } from '@dz-web/esboot-bundler-vite';

export default defineConfig<BundlerOptions>((cfg) => {
  return {
    isSP: false,
    bundler: Bundler,
    // bundlerOptions: {},
    bundlerOptions: { mfsu: true },
    server: {
      port: 8111,
    },
    minify: false,
    sourceMap: true,
    define: {
      'process.env.isMobile': String(cfg.isMobile),
      'process.env.isBrowser': String(cfg.isBrowser),
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
  };
});
