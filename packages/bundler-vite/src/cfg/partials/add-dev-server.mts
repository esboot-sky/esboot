import type { AddFunc } from '@/cfg/types.mts';
import type { CustomViteConfiguration } from '@/types.mts';

export const addDevServer: AddFunc = async (cfg, viteCfg) => {
  const {
    isDev,
    server: { port, open, host, proxy },
  } = cfg.config;

  if (!isDev) return;

  const server: CustomViteConfiguration['server'] = {
    port,
    open,
    host,
    strictPort: true,
    middlewareMode: true,
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
              return path.replace(new RegExp(key), item.pathRewrite?.[key] ?? '');
            };
          }
        }
      }
    }
  }

  viteCfg.server = server;
};
