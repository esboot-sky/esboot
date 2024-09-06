import { join } from 'path';

import type { AddFunc } from '@/cfg/types.mts';

const getVersion = (cwd: string) => {
  const pkg = require(join(cwd, 'package.json'));
  return pkg.version;
};

export const addCompatHtmlPlugin: AddFunc = async function (cfg, viteCfg) {
  const { publicPath, isDev, cwd, ipv4, isBrowser } = cfg.config;
  const isInjectBridgeMock = !isBrowser && isDev;

  viteCfg.plugins!.push({
    name: 'vite-plugin-inject-body',
    transformIndexHtml(html) {
      const injectScript = `
        <script src="${publicPath}config.js?v=${
          process.env.BUILD_VERSION || getVersion(cwd)
        }"></script>  
        ${
          isInjectBridgeMock
            ? `<script>
          window.brigeMockHost = "http://${process.env.BRIDGE_MOCK_HOST || ipv4}";
          window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3000};
          </script>`
            : ''
        }
      `;
      return html.replace(/<body>/, `<body>${injectScript}`);
    },
  });
};
