import type { AddFunc } from '@/cfg/types.mts';
import type { CustomViteConfiguration } from '@/types.mts';

const getServerType = (https: boolean, http2: boolean) => {
  if (http2) return 'spdy';
  if (https) return 'https';
  return 'http';
};

export const addDevServer: AddFunc = async (cfg, viteCfg, options) => {
  const {
    cwd,
    isDev,
    server: { port, open, host, proxy, http2, https },
  } = cfg.config;

  if (!isDev) return;

  const server: CustomViteConfiguration['server'] = {
    port,
    open,
    host,
    strictPort: true,
  };

  if (proxy) {
    server.proxy = {};

    for (const item of proxy) {
      for (const context of item.context) {
        server.proxy[context] = {
          target: item.target,
          changeOrigin: item.changeOrigin || true,
        };

        if (item.pathRewrite) {
          for (const key in item.pathRewrite) {
            server.proxy[context].rewrite = (path) => {
              return path.replace(key, item.pathRewrite?.[key] ?? '');
            };
          }
        }
      }
    }
  }

  viteCfg.server = server;
};
