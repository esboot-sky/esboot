import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';
import { ip } from 'address';

import type { MFSU } from '@/cfg/helpers/mfsu';
import type { AddFunc } from '@/cfg/types';

export const addDevServer: AddFunc<{ mfsu: MFSU }> = async function (
  cfg,
  webpackCfg,
  options
) {
  const {
    isDev,
    server: { port, open, host },
  } = cfg.config;

  if (!isDev) return;

  const { mfsu } = options!;
  const devServer: DevServerConfiguration = {
    compress: true,
    open,
    hot: true,
    client: {
      progress: false,
      logging: 'error',
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    setupMiddlewares(middlewares: any[]) {
      middlewares.unshift(...(mfsu?.getMiddlewares() ?? []));
      return middlewares;
    },
    port,
    host: host || '0.0.0.0',
    onListening(devServerInstance) {
      if (!devServerInstance) {
        throw new Error('webpack-dev-server is not defined');
      }

      const { port } = devServerInstance.server?.address() as any;
      ready(
        `started server on [::]:${port}, url: ${kleur
          .underline()
          .green(`http://${ip()}:${port}`)} \n`
      );
    },
  };

  webpackCfg.devServer = devServer;
};
