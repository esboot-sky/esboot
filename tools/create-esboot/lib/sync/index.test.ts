import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, expect, test } from 'bun:test';

import { syncTemplateFiles } from './index';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

test('syncTemplateFiles keeps nested package.json files and removes the root one', async () => {
  const baseDir = mkdtempSync(join(tmpdir(), 'create-esboot-sync-'));
  tempDirs.push(baseDir);

  const repoDir = join(baseDir, 'repo');
  const templateDir = join(baseDir, 'template');

  mkdirSync(join(repoDir, 'dev/tools/src'), { recursive: true });
  mkdirSync(templateDir, { recursive: true });

  writeFileSync(
    join(repoDir, 'package.json'),
    JSON.stringify({ name: 'root-template' }, null, 2),
  );
  writeFileSync(
    join(repoDir, 'dev/tools/package.json'),
    JSON.stringify({ name: 'nested-tool' }, null, 2),
  );
  writeFileSync(join(repoDir, 'dev/tools/src/index.js'), 'console.log("hello");\n');

  await syncTemplateFiles({ repoDir, templateDir });

  expect(existsSync(join(templateDir, 'package.json'))).toBe(false);
  expect(readFileSync(join(templateDir, 'dev/tools/package.json'), 'utf8')).toContain(
    '"name": "nested-tool"',
  );
  expect(readFileSync(join(templateDir, 'dev/tools/src/index.js'), 'utf8')).toContain(
    'console.log("hello");',
  );
});
