import type { ConfigurationInstance } from '@dz-web/esboot';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { isUndefined } from '@dz-web/esboot-common/lodash';

async function getVersion(cwd: string): Promise<string> {
  const pkg = await import(pathToFileURL(join(cwd, 'package.json')).href, { with: { type: 'json' } });
  return pkg.version;
}

export async function injectHtml(html: string, cfg: ConfigurationInstance, title?: string): Promise<string> {
  const { BRIDGE_MOCK_HOST, BRIDGE_MOCK_PORT, BUILD_VERSION } = process.env;
  const { isBrowser, ipv4, publicPath, isDev, cwd, configJSPath, define } = cfg.config;

  const isConfigJSExists = existsSync(configJSPath);
  const version = BUILD_VERSION || (await getVersion(cwd));
  const isInjectBridgeMock = !isBrowser && isDev;

  const bodyInjections: string[] = [];
  if (isConfigJSExists) {
    bodyInjections.push(`<script src="${publicPath}config.js?v=${version}"><\/script>`);
  }
  if (isInjectBridgeMock) {
    bodyInjections.push(`<script>
    window.brigeMockHost = "http://${BRIDGE_MOCK_HOST || ipv4}";
    window.brigeMockPort = ${BRIDGE_MOCK_PORT || 3000};
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

  const escapeRegex = /[.*+?^${}()|[\]\\]/g;
  const patterns = Array.from(replacements.keys())
    .map(key => key.replace(escapeRegex, '\\$&'))
    .join('|');

  return html.replace(
    new RegExp(patterns, 'g'),
    match => replacements.get(match) || match,
  );
}
