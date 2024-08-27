import { defineConfig } from '@dz-web/esboot';
import { BundlerWebpack } from '@dz-web/esboot-bundler-webpack';
import type { BundlerWebpackOptions } from "@dz-web/esboot-bundler-webpack";

export default defineConfig<BundlerWebpackOptions>((cfg) => {
  return {
    isSP: false,
    bundler: BundlerWebpack,
    bundlerOptions: { mfsu: false },
    server: {
      port: 8111,
    },
    define: {
      'process.env.isMobile': cfg.isMobile as any,
      'process.env.isBrowser': cfg.isBrowser as any,
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
