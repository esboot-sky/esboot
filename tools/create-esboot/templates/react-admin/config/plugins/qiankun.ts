import http from 'node:http';
import { definePlugin, PluginHooks } from '@dz-web/esboot';
import qiankun from 'vite-plugin-qiankun-lite';

export interface PluginQiankunOptions {
  name: string;
  sandbox?: boolean;
  port?: number;
  host?: string;
  publicPath?: string | { dev?: string; prod?: string };
  cors?: boolean;
}

let isHeaderPatched = false;

export default function pluginQiankun(options: PluginQiankunOptions) {
  if (!isHeaderPatched) {
    isHeaderPatched = true;
    const originalWriteHead = http.ServerResponse.prototype.writeHead;
    http.ServerResponse.prototype.writeHead = function (this: any, statusCode: number, ...args: any[]) {
      try {
        this.setHeader('Access-Control-Allow-Origin', '*');
        this.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS');
        this.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');
      } catch {
        // ignore
      }
      return originalWriteHead.call(this, statusCode, ...args);
    };
  }

  const host = options.host ?? '0.0.0.0';
  const cors = options.cors ?? true;

  const getPublicPath = (contextEnv?: string) => {
    const isProd = contextEnv === 'production' || process.env.NODE_ENV === 'production';
    if (typeof options.publicPath === 'object') {
      return isProd ? (options.publicPath.prod ?? `/${options.name}/`) : (options.publicPath.dev ?? '/');
    }
    if (typeof options.publicPath === 'string') {
      return isProd ? options.publicPath : '/';
    }
    return isProd ? `/${options.name}/` : '/';
  };

  return definePlugin({
    name: 'esboot-plugin-qiankun',
    [PluginHooks.modifyConfig]: (config: any, context?: any) => {
      if (!config) return;

      const publicPath = getPublicPath(context?.env);
      config.publicPath = publicPath;
      config.server = config.server || {};
      if (options.port) config.server.port = options.port;
      config.server.host = host;
      config.server.cors = cors;

      return config;
    },
    [PluginHooks.modifyBundlerConfig]: (_cfg, bundlerConfig: any, _name?: any, context?: any) => {
      if (!bundlerConfig) return;

      const publicPath = getPublicPath(context?.env);
      bundlerConfig.base = publicPath;

      bundlerConfig.server = bundlerConfig.server || {};
      bundlerConfig.server.host = host;
      if (options.port) bundlerConfig.server.port = options.port;
      bundlerConfig.server.cors = cors;

      bundlerConfig.plugins = bundlerConfig.plugins || [];
      bundlerConfig.plugins.push(
        qiankun({
          name: options.name,
          sandbox: options.sandbox ?? false,
        }),
      );
    },
  });
}
