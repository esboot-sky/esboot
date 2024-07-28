import { join } from 'path';
import type { ConfigurationInstance } from '@dz-web/esboot';
import InjectBodyPlugin from 'inject-body-webpack-plugin';
import Config from 'webpack-5-chain';

const getVersion = (cwd: string) => {
  const pkg = require(join(cwd, 'package.json'));
  return pkg.version;
};

export async function addInjectBodyPlugin(
  cfg: ConfigurationInstance,
  webpackChain: Config
) {
  const { isBrowser, ipv4, publicPath, isDev, cwd } = cfg.config;

  const isInjectBridgeMock = !isBrowser && isDev;

  webpackChain.plugin('inject-body-plugin').use(InjectBodyPlugin as any, [
    {
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
    },
  ]);
}
