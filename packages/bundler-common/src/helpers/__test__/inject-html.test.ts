import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { injectHtml } from '../inject-html';

const tmpRoots: string[] = [];

async function createProject(version = '1.2.3') {
  const cwd = await mkdtemp(join(tmpdir(), 'esboot-inject-html-'));
  tmpRoots.push(cwd);
  await writeFile(join(cwd, 'package.json'), JSON.stringify({ version }));

  return cwd;
}

function createCfg(cwd: string, configJSPath: string) {
  return {
    config: {
      cwd,
      configJSPath,
      define: {
        '{{unused}}': 'unused',
        'process.env.NAME': 'esboot',
        'process.env.ENABLED': true,
      },
      ipv4: '127.0.0.1',
      isBrowser: true,
      isDev: false,
      publicPath: './',
    },
  } as any;
}

afterEach(async () => {
  await Promise.all(tmpRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  delete process.env.BRIDGE_MOCK_HOST;
  delete process.env.BRIDGE_MOCK_PORT;
  delete process.env.BUILD_VERSION;
});

describe('injectHtml', () => {
  it('injects title, config script, and define placeholders', async () => {
    const cwd = await createProject();
    const configJSPath = join(cwd, 'config/config.js');
    await mkdir(join(cwd, 'config'), { recursive: true });
    await writeFile(configJSPath, 'window.appConfig = {};');

    const html = await injectHtml(
      '<html><head></head><body>{{process.env.NAME}} {{process.env.ENABLED}}</body></html>',
      createCfg(cwd, configJSPath),
      'ESBoot',
    );

    expect(html).toBe(
      '<html><head><title>ESBoot</title></head><body><script src="./config.js?v=1.2.3"></script>esboot true</body></html>',
    );
  });

  it('injects bridge mock script for native dev pages', async () => {
    const cwd = await createProject();
    const cfg = createCfg(cwd, join(cwd, 'missing-config.js'));
    cfg.config.isBrowser = false;
    cfg.config.isDev = true;
    process.env.BRIDGE_MOCK_HOST = 'localhost';
    process.env.BRIDGE_MOCK_PORT = '3100';

    const html = await injectHtml('<html><head></head><body></body></html>', cfg);

    expect(html).toContain('window.brigeMockHost = "http://localhost";');
    expect(html).toContain('window.brigeMockPort = 3100;');
  });
});
