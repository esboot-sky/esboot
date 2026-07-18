import type { ConfigurationInstance } from '@dz-web/esboot';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { shellEnv } from '@dz-web/esboot-common/environment';
import { isUndefined } from '@dz-web/esboot-common/lodash';

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

async function getVersion(cwd: string): Promise<string> {
  const pkg = await import(pathToFileURL(join(cwd, 'package.json')).href, { with: { type: 'json' } });
  return pkg.version;
}

export async function injectHtml(html: string, cfg: ConfigurationInstance, title?: string): Promise<string> {
  const bridgeMockHost = shellEnv.get('BRIDGE_MOCK_HOST');
  const bridgeMockPort = shellEnv.get('BRIDGE_MOCK_PORT');
  const buildVersion = shellEnv.get('BUILD_VERSION');
  const { isBrowser, ipv4, publicPath, isDev, cwd, configJSPath, define } = cfg.config;

  const isConfigJSExists = existsSync(configJSPath);
  const version = buildVersion || (await getVersion(cwd));
  const isInjectBridgeMock = !isBrowser && isDev;

  const bodyInjections: string[] = [];
  if (isConfigJSExists) {
    bodyInjections.push(`<script src="${publicPath}config.js?v=${version}"><\/script>`);
  }
  if (isInjectBridgeMock) {
    bodyInjections.push(`<script>
    window.brigeMockHost = "http://${bridgeMockHost || ipv4}";
    window.brigeMockPort = ${bridgeMockPort || 3000};
        <\/script>`);
  }

  const replacements = new Map<string, string>();

  if (bodyInjections.length > 0) {
    replacements.set('<body>', `<body>${bodyInjections.join('')}`);
  }

  if (!isUndefined(title)) {
    replacements.set('<head>', `<head><title>${title}</title>`);
  }

  if (define) {
    Object.entries(define).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      replacements.set(placeholder, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }

  if (replacements.size === 0) {
    return html;
  }

  const patterns = Array.from(replacements.keys())
    .map(key => key.replace(ESCAPE_REGEX, '\\$&'))
    .join('|');

  return html.replace(
    new RegExp(patterns, 'g'),
    match => replacements.get(match) || match,
  );
}
