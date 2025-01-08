import { join } from 'node:path';
import { isUndefined } from '@dz-web/esboot-common/lodash';
import type { ConfigurationInstance } from '@dz-web/esboot';

const getVersion = (cwd: string) => {
  const pkg = require(join(cwd, 'package.json'));
  return pkg.version;
};

export const injectHtml = (
  html: string,
  cfg: ConfigurationInstance,
  title?: string
) => {
  const { BRIDGE_MOCK_HOST, BRIDGE_MOCK_PORT, BUILD_VERSION } = process.env;
  const { isBrowser, ipv4, publicPath, isDev, cwd } = cfg.config;

  const version = BUILD_VERSION || getVersion(cwd);
  const isInjectBridgeMock = !isBrowser && isDev;

  const importCfgScript = `<script src="${publicPath}config.js?v=${version}">
  <\/script>`;
  const injectBridgeMockScript = isInjectBridgeMock
    ? `<script>
    window.brigeMockHost = "http://${BRIDGE_MOCK_HOST || ipv4}";
    window.brigeMockPort = ${BRIDGE_MOCK_PORT || 3000};
        <\/script>`
    : '';

  let _html = html.replace(
    '<body>',
    `<body>${importCfgScript}${injectBridgeMockScript}`
  );
  if (!isUndefined(title))
    _html = _html.replace('<head>', `<head><title>${title}</title>`);

  return _html;
};
