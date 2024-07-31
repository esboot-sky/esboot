import react from '@vitejs/plugin-react';

// import type { ViteDevServer } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';

export const getDevServer = (cfg: ConfigurationInstance): any => {
  const { cwd } = cfg.config;

  const devServer = {
    plugins: [react()],
    configFile: false,
    root: cwd,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 1337,
    },
  };

  return devServer;
}