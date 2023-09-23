import { join } from 'path';
import InjectBodyPlugin from 'inject-body-webpack-plugin';

import ip from '@@/helpers/ip';
import esbootConfig from '@@/config';

import { ApplyOpts } from '../types';

const getVersion = () => {
  const pkg = require(join(process.cwd(), 'package.json'));
  return pkg.version;
};

export const addInjectBodyPlugin = async (applyOpts: ApplyOpts) => {
  const { isBrowser } = esbootConfig.compileTimeConfig;
  const {
    config,
    isDev,
    userOpts: { publicPath },
  } = applyOpts;

  const isInjectBridgeMock = !isBrowser && isDev;

  config.plugins.push(
    // @ts-ignore
    new InjectBodyPlugin({
      position: 'start',
      content: `
      <script src="${publicPath}config.js?v=${
        // jenkins version
        process.env.BUILD_VERSION || getVersion()
      }">
      <\/script>

      ${
        isInjectBridgeMock
          ? `<script>
        window.brigeMockHost = "http://${process.env.BRIDGE_MOCK_HOST || ip}";
        window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3000};
        <\/script>`
          : ''
      }
      `,
    })
  );
};
