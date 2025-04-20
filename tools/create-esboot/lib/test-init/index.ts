import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { $ } from 'bun';

import { rootDir, supportedTemplate, type ETemplate } from '../constant';

async function main() {
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
