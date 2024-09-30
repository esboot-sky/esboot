import { defineConfig, PluginHooks, type Configuration, definePlugin } from '@dz-web/esboot';
// import { BundlerVite as Bundler, type BundlerViteOptions as BundlerOptions  } from '@dz-web/esboot-bundler-vite';
import { BundlerWebpack as Bundler, CodeSplittingType, type BundlerWebpackOptions as BundlerOptions } from '@dz-web/esboot-bundler-webpack';
// import { BundlerRspack as Bundler, type BundlerRspackOptions as BundlerOptions } from '@dz-web/esboot-bundler-rspack';
import pluginVitest from '@dz-web/esboot-plugin-vitest';
import pluginDocs from '@dz-web/esboot-plugin-docs';

export default defineConfig<BundlerOptions>({
  plugins: [
    pluginDocs(),
    pluginVitest(),
    definePlugin({
      key: 'test1',
      onActivated: () => {
        console.log('test plugin onActivated');
      },
      [PluginHooks.modifyConfig]: (config) => {
        // console.log('modifyBundlerConfig', config);
        return {
          // publicPath: '/tetett/',
        };
      },
      [PluginHooks.registerCommands]: (cfg) => {
        return [
          {
            name: 'test1',
            description: 'testlkjsjdfklsjdlkf',
            options: ['-f, --file <char>', '-s, --sampleFile <char>'],
            action: (options) => {
              console.log('tes234324234t', options);
            },
          },
        ];
      },
      [PluginHooks.modifyTypescriptConfig]: (cfg, result) => {
        return {
          compilerOptions: {
            baseUrl: 'src',
          },
        };
      },
      [PluginHooks.modifyPrettierConfig]: (cfg, result) => {
        return {
          printWidth: 1000,
        };
      },
      [PluginHooks.modifyStylelintConfig]: (cfg, result) => {
        return {
          printWidth: 1000,
        };
      },
      [PluginHooks.modifyEslintConfig]: (cfg, result) => {
        return {
          printWidth: 1000,
        };
      },
      [PluginHooks.modifyBundlerConfig]: (cfg, bundlerConfig, bundlerName) => {
        console.log(bundlerName, 'name');
        bundlerConfig.output.publicPath = '/modu';
      },
      [PluginHooks.afterCompile]: (cfg) => {
        console.log(cfg.entry);
      },
    }),
    definePlugin({
      key: 'test2',
      registerCommands: () => {
        return [
          {
            name: 'test2',
            description: 'test2',
            action: () => {
              console.log('test2');
            },
          },
        ];
      },
    }),
  ],
  bundler: Bundler,
  isSP: true,
  bundlerOptions: { mfsu: false },
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
    port: 4000,
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
