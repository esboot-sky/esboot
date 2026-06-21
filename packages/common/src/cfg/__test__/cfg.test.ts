import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ESBootCfg } from '../cfg';

const tmpRoots: string[] = [];

async function createProject(configSource: string) {
  const cwd = await mkdtemp(join(tmpdir(), 'esboot-cfg-'));
  tmpRoots.push(cwd);
  await mkdir(join(cwd, 'src'), { recursive: true });
  await mkdir(join(cwd, 'config'), { recursive: true });
  await writeFile(join(cwd, '.esbootrc.ts'), configSource);

  return cwd;
}

afterEach(async () => {
  await Promise.all(tmpRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  delete process.env.ESBOOT_PLATFORM;
  delete process.env.ESBOOT_PAGE_TYPE;
  delete process.env.ESBOOT_IS_CI_BUILD;
  delete process.env.BROWSERSLIST_ENV;
  process.env.NODE_ENV = 'test';
});

describe('esboot cfg', () => {
  it('defaults tailwind config under css', () => {
    const cfg = new ESBootCfg();

    expect(cfg.config.css.tailwind).toEqual({
      enable: true,
      version: 'next',
      separateImports: false,
    });
  });

  it('creates isolated default configuration for each instance', () => {
    const first = new ESBootCfg();

    first.patch({
      alias: {
        '@leaked': 'src/leaked',
      },
      server: {
        port: 12345,
      },
    });

    const second = new ESBootCfg();

    expect(second.config.alias).not.toHaveProperty('@leaked');
    expect(second.config.server.port).not.toBe(12345);
  });

  it('loads SP config and derives root aliases and static config paths', async () => {
    process.env.NODE_ENV = 'development';
    const cwd = await createProject(`
      export default {
        isSP: true,
        alias: { '@@': 'src' },
        server: { port: 4000 },
      };
    `);

    const cfg = new ESBootCfg();
    await cfg.load({ cwd });

    expect(cfg.config).toMatchObject({
      cwd,
      isSP: true,
      isDev: true,
      publicPath: '/',
      server: {
        port: 4000,
      },
      alias: {
        '@': 'src',
        '@@': 'src',
      },
      configJSPath: join(cwd, 'config/config.js'),
      staticPathList: [
        {
          from: join(cwd, 'config/config.js'),
          to: './config.js',
        },
        {
          from: join(cwd, 'config/static'),
          to: './static',
        },
      ],
    });
  });

  it('loads MP config from env and derives platform aliases and browserslist env', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ESBOOT_PLATFORM = 'mobile';
    process.env.ESBOOT_PAGE_TYPE = 'native';
    const cwd = await createProject(`
      export default {
        alias: { '@@': 'src' },
        server: { port: 5000 },
      };
    `);

    const cfg = new ESBootCfg();
    await cfg.load({ cwd });

    expect(process.env.BROWSERSLIST_ENV).toBe('mobile-native-production');
    expect(cfg.config).toMatchObject({
      cwd,
      isSP: false,
      isDev: false,
      isMobile: true,
      isBrowser: false,
      publicPath: './',
      useLangJsonPicker: true,
      alias: {
        '@': 'src',
        '@@': 'src',
        '@mobile': 'src/platforms/mobile',
        '@mobile-native': 'src/platforms/mobile/_native',
        '@mobile-browser': 'src/platforms/mobile/_browser',
        '@pc': 'src/platforms/pc',
      },
      MPConfiguration: {
        platform: 'mobile',
        pageType: 'native',
        contentRootPath: join(cwd, 'src/platforms/mobile/_native'),
      },
      configJSPath: join(cwd, 'config/mobile/_native/config.js'),
    });
    expect(cfg.config.staticPathList).toEqual([
      {
        from: join(cwd, 'config/mobile/_native/config.js'),
        to: './config.js',
      },
      {
        from: join(cwd, 'config/mobile/_native/static'),
        to: './static',
      },
      {
        from: join(cwd, 'config/mobile/static'),
        to: './static',
      },
      {
        from: join(cwd, 'config/static'),
        to: './static',
      },
    ]);
  });

  it('rejects invalid known user config fields with a readable error', async () => {
    const cwd = await createProject(`
      export default {
        server: { port: '3000' },
      };
    `);

    const cfg = new ESBootCfg();

    await expect(cfg.load({ cwd })).rejects.toMatchObject({
      message: 'esboot config load error',
      filePath: join(cwd, '.esbootrc.ts'),
      issues: [
        {
          path: 'server.port',
          message: 'Invalid input: expected number, received string',
        },
      ],
    });
  });

  it('allows unknown user config fields to support bundler-specific extensions', async () => {
    const cwd = await createProject(`
      export default {
        bundler: null,
        bundlerOptions: {
          customConfig: () => ({}),
        },
        server: { port: 4001 },
      };
    `);

    const cfg = new ESBootCfg<any>();

    await expect(cfg.load({ cwd })).resolves.toBeUndefined();
    expect(cfg.config.server.port).toBe(4001);
    expect(cfg.config.bundler).toBeNull();
    expect(cfg.config.bundlerOptions).toMatchObject({
      customConfig: expect.any(Function),
    });
  });
});
