import type { ETemplate } from '../constant';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import { $ } from 'bun';
import { rootDir, supportedTemplate } from '../constant';

async function main(): Promise<void> {
  const template = process.argv[2];

  if (!supportedTemplate.includes(template as ETemplate)) {
    throw new Error(`Not supported template: ${template}`);
  }

  const targetDir = join(rootDir, 'tmp', `esboot-react-${template}`);

  if (existsSync(targetDir)) {
    await $`rm -rf ${targetDir}`;
  }

  mkdirSync(targetDir, { recursive: true });

  await $`cd ${targetDir} && bun run ${join(__dirname, '../../bin/create-esboot.js')}`;
}

main();
