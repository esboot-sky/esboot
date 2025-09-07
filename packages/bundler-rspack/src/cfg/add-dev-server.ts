import type { Configuration as DevServerConfiguration } from '@rspack/dev-server';
import type { AddFunc } from '@/cfg/types';
import { logDevServer } from '@dz-web/esboot-bundler-common';

function getServerType(https: boolean, http2: boolean): string {
  if (http2)
    return 'spdy';
  if (https)
    return 'https';
  return 'http';
}

export const addDevServer: AddFunc = async (cfg, rspackCfg) => {
  const {
    isDev,
    server: { port, open, host, proxy, http2, https },
  } = cfg.config;

  if (!isDev)
    return;

  const isHttps = !!https || !!http2;

  const devServer: DevServerConfiguration = {
    compress: true,
    allowedHosts: 'all',
    open,
    hot: true,
    client: {
      progress: false,
      logging: 'error',
      overlay: false,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    setupMiddlewares(middlewares: any[]) {
      return middlewares;
    },
    // watchFiles: {
    //   paths: ['src/**/*', '.esbootrc.ts', '.env', '.env.local'],
    //   options: {
    //     usePolling: true,
    //   },
    // },
    port,
    server: getServerType(!!https, !!http2),
    host: host || '0.0.0.0',
    onListening(devServer) {
      if (!devServer) {
        throw new Error('@rspack/dev-server is not defined');
      }

      // @ts-ignore
      const port = devServer.server?.address()?.port ?? 0;
      logDevServer(port, isHttps);
    },
  };
  if (proxy)
    devServer.proxy = proxy;

  rspackCfg.devServer = devServer;
};
