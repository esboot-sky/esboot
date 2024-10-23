import { defineConfig } from "@dz-web/esboot";
import {
  BundlerWebpack,
  type BundlerWebpackOptions,
  CodeSplittingType,
} from "@dz-web/esboot-bundler-webpack";
import {
  BundlerVite,
  type BundlerViteOptions,
} from "@dz-web/esboot-bundler-vite";
import pluginVitest from "@dz-web/esboot-plugin-vitest";

import pkg from "./package.json";

export default defineConfig<BundlerViteOptions | BundlerWebpackOptions>(
  (cfg) => {
    const { isDev } = cfg;

    return {
      isSP: true,
      plugins: [pluginVitest()],
      bundler: isDev ? BundlerVite : BundlerWebpack,
      bundlerOptions: isDev
        ? {}
        : {
            mfsu: false,
            codeSplitting: {
              jsStrategy: CodeSplittingType.granularChunks,
              jsStrategyOptions: {
                frameworkBundles: [
                  "dayjs",
                  "@tanstack/react-query",
                  "zustand",
                  "immer",
                  "lodash",
                  "nanoid",
                  "@dz-web/axios",
                  "@dz-web/axios-middlewares",
                  "axios",
                  "react-intl",
                  "@loadable/component",
                  "@dz-web/esboot-browser",
                ],
              },
            },
          },
      server: {
        port: 11103,
      },
    };
  },
);
