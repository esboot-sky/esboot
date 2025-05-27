import type { AddFunc } from '@/cfg/types';
import type { CustomViteConfiguration } from '@/types';

export const addDevServer: AddFunc = async (cfg, viteCfg) => {
  const {
    isDev,
    server: { port = 3000, open, host, proxy },
  } = cfg.config;

  if (!isDev) return;

  const server: CustomViteConfiguration['server'] = {
    port,
    open,
    host,
    strictPort: true,
    middlewareMode: true,
    hmr: {
      port: port + 1,
    },
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
              return path.replace(
                new RegExp(key),
                item.pathRewrite?.[key] ?? ''
              );
            };
          }
        }
      }
    }
  }

  viteCfg.server = server;
};
