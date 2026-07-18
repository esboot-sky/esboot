import type { EnvProvider } from '@dz-web/esboot-common/environment';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from '@dz-web/esboot-common/environment';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addEntry } from '../add-entry';

const tmpRoots: string[] = [];
let previousProvider: EnvProvider;

function createCfg(rootPath: string, isSP = true) {
  const cfg = {
    config: {
      isSP,
      rootPath,
      ipv4: '127.0.0.1',
      server: {
        port: 4173,
      },
      MPConfiguration: isSP
        ? undefined
        : {
            contentRootPath: join(rootPath, 'platforms/mobile/_browser'),
          },
    },
    patch(update: any) {
      Object.assign(this.config, update);
    },
  };

  return cfg as any;
}

async function createTempSrc() {
  const root = await mkdtemp(join(tmpdir(), 'esboot-add-entry-'));
  tmpRoots.push(root);
  const src = join(root, 'src');
  await mkdir(src, { recursive: true });

  return src;
}

async function writeEntry(filePath: string, content: string) {
  await mkdir(filePath.replace(/[/\\][^/\\]+$/, ''), { recursive: true });
  await writeFile(filePath, content);
}

beforeEach(() => {
  previousProvider = setShellEnvProvider(createRecordEnvProvider({}));
});

afterEach(async () => {
  await Promise.all(tmpRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  setShellEnvProvider(previousProvider);
});

describe('addEntry', () => {
  it('discovers SP entry files and reads exported metadata', async () => {
    const rootPath = await createTempSrc();
    await writeEntry(
      join(rootPath, 'index.entry.tsx'),
      `
        export default {
          title: 'Home',
          template: 'mobile',
          name: 'home',
          langJsonPicker: ['home', 'global'],
          urlParams: '?debug=1',
        };
      `,
    );

    const cfg = createCfg(rootPath);
    const callbacks: any[] = [];
    await addEntry(cfg, params => callbacks.push(params));

    expect(Object.keys(cfg.config.entry)).toEqual(['home']);
    expect(cfg.config.entry.home).toMatchObject({
      title: 'Home',
      chunkName: 'home',
      fileName: 'index',
      tpl: 'template/mobile.html',
      langJsonPicker: ['home', 'global'],
      url: 'http://127.0.0.1:4173/home.html?debug=1',
      urlParams: '?debug=1',
    });
    expect(callbacks).toEqual([
      expect.objectContaining({
        title: 'Home',
        chunkName: 'home',
        template: 'template/mobile.html',
        urlParams: '?debug=1',
      }),
    ]);
  });

  it('discovers MP entries from the derived content root instead of root src', async () => {
    const rootPath = await createTempSrc();
    await writeEntry(
      join(rootPath, 'index.entry.tsx'),
      `export default { title: 'Root' };`,
    );
    await writeEntry(
      join(rootPath, 'platforms/mobile/_browser/test.entry.tsx'),
      `export default { title: 'Mobile Browser' };`,
    );

    const cfg = createCfg(rootPath, false);
    await addEntry(cfg);

    expect(Object.keys(cfg.config.entry)).toEqual(['test']);
    expect(cfg.config.entry.test).toMatchObject({
      title: 'Mobile Browser',
      chunkName: 'test',
      fileName: 'test',
    });
  });

  it('honors ESBOOT_CONTENT_PATTERN and ESBOOT_CONTENT_IGNORE', async () => {
    const rootPath = await createTempSrc();
    await writeEntry(join(rootPath, 'keep.entry.ts'), `export default { title: 'Keep' };`);
    await writeEntry(join(rootPath, 'skip.entry.ts'), `export default { title: 'Skip' };`);
    await writeEntry(join(rootPath, 'other.entry.ts'), `export default { title: 'Other' };`);

    shellEnv.set('ESBOOT_CONTENT_PATTERN', '*');
    shellEnv.set('ESBOOT_CONTENT_IGNORE', 'skip,other');

    const cfg = createCfg(rootPath);
    await addEntry(cfg);

    expect(Object.keys(cfg.config.entry)).toEqual(['keep']);
  });

  it('throws when two entry files resolve to the same chunk name', async () => {
    const rootPath = await createTempSrc();
    await writeEntry(join(rootPath, 'pages/a/index.entry.tsx'), `export default { title: 'A' };`);
    await writeEntry(join(rootPath, 'pages/b/index.entry.tsx'), `export default { title: 'B' };`);

    await expect(addEntry(createCfg(rootPath))).rejects.toThrow(
      /Duplicate entry chunkName "index"/,
    );
  });
});
