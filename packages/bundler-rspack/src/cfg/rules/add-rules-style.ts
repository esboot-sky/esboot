import { addTailwindCSS } from '@dz-web/esboot-bundler-common';
import type { AddFunc } from '@/cfg/types';

export const addStyleRules: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  rspackCfg.experiments.css = true;
  rspackCfg.module.rules.push({
    test: /\.(sass|scss)$/,
    use: [
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [addTailwindCSS(cfg), require.resolve('autoprefixer')],
          },
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          // using `modern-compiler` and `sass-embedded` together significantly improve build performance,
          // requires `sass-loader >= 14.2.1`
          api: 'modern-compiler',
          implementation: require.resolve('sass-embedded'),
        },
      },
    ],
    type: 'css/auto',
  });
};
