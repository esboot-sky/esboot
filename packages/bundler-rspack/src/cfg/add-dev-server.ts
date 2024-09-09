import type { Configuration as DevServerConfiguration } from '@rspack/dev-server';
import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';
// import { ip } from 'address';

import type { AddFunc } from '@/cfg/types';

const getServerType = (https: boolean, http2: boolean) => {
  if (http2) return 'spdy';
  if (https) return 'https';
  return 'http';
};

export const addDevServer: AddFunc = async function (cfg, rspackCfg) {
  const {
    isDev,
    server: { port, open, host, proxy, http2, https },
  } = cfg.config;

  if (!isDev) return;

  const isHttps = !!https || !!http2;

  const devServer: DevServerConfiguration = {
    compress: true,
    allowedHosts: 'all',
    open,
    hot: true,
    client: {
      logging: 'info',
    },
    // client: {
    //   progress: false,
    //   logging: 'error',
    //   overlay: false,
    // },
    historyApiFallback: {
      disableDotRule: true,
    },
    // setupMiddlewares(middlewares: any[]) {
    //   return middlewares;
    // },
    port,
    // server: getServerType(!!https, !!http2),
    host: host || '0.0.0.0',
    // onListening(devServer) {
    //   if (!devServer) {
    //     throw new Error('@rspack/dev-server is not defined');
    //   }

    //   // const port = devServer?.server?.address().port ?? 0;
    //   const port = 0;
    //   ready(
    //     `started server on [::]:${port}, url: ${kleur
    //       .underline()
    //       .green(`${isHttps ? 'https' : 'http'}://:${port}`)} \n`
    //   );
    // },
  };
  if (proxy) devServer.proxy = proxy;

  rspackCfg.devServer = devServer;
};
