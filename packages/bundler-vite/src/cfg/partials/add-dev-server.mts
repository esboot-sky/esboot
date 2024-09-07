import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

import type { AddFunc } from '@/cfg/types.mts';

const getServerType = (https: boolean, http2: boolean) => {
  if (http2) return 'spdy';
  if (https) return 'https';
  return 'http';
};

export const addDevServer: AddFunc = async function (cfg, viteCfg, options) {
  const {
    isDev,
    server: { port, open, host, proxy, http2, https },
  } = cfg.config;

  if (!isDev) return;

  const isHttps = !!https || !!http2;

  viteCfg.server = {
    port,
    open,
    host,
    // proxy,
    // https,
    // http2,
  };

  // webpackCfg.devServer = devServer;
};
