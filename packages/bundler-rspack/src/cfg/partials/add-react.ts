import type { AddFunc } from '@/cfg/types';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

export const addReact: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  rspackCfg.module.rules.push(
    {
      test: /\.(j|t)s$/,
      exclude: [/[\\/]node_modules[\\/]/],
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
          },
          externalHelpers: true,
          transform: {
            react: {
              runtime: 'automatic',
              development: isDev,
              refresh: isDev,
            },
          },
        },
        env: {
          targets: 'Chrome >= 48',
        },
      },
    },
    {
      test: /\.tsx$/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: isDev,
                refresh: isDev,
              },
            },
          },
        },
      },
      type: 'javascript/auto',
    },
    {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [require.resolve('@svgr/webpack')],
    }
  );

  if (isDev) {
    rspackCfg.plugins.push(new ReactRefreshPlugin());
  }
};
