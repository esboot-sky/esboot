import { join } from 'node:path';
import InjectBodyPlugin from 'inject-body-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

const getVersion = (cwd: string) => {
  const pkg = require(join(cwd, 'package.json'));
  return pkg.version;
};

export const addInjectBodyPlugin: AddFunc = async (cfg, webpackCfg) => {
  const { isBrowser, ipv4, publicPath, isDev, cwd } = cfg.config;

  const isInjectBridgeMock = !isBrowser && isDev;

  webpackCfg.plugins.push(
    // @ts-ignore
    new InjectBodyPlugin({
      position: 'start',
      content: `
      <script src="${publicPath}config.js?v=${
        // jenkins version
        process.env.BUILD_VERSION || getVersion(cwd)
      }">
      <\/script>

      ${
        isInjectBridgeMock
          ? `<script>
        window.brigeMockHost = "http://${process.env.BRIDGE_MOCK_HOST || ipv4}";
        window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3000};
        <\/script>`
          : ''
      }
      `,
    })
  );
};
