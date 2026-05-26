import type { ETemplate } from '../constant';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import { logger } from '@umijs/utils';

import { $ } from 'bun';
import { supportedTemplate } from '../constant';

const owner = 'esboot-sky';

export async function syncTemplateFiles(opts: {
  repoDir: string;
  templateDir: string;
}): Promise<void> {
  const { repoDir, templateDir } = opts;

  logger.wait('Starting to upgrade template...');
  await $`rsync -av --exclude=".git" --exclude="pnpm-lock.yaml" --exclude="pnpm-workspace.yaml" ${repoDir}/ ${templateDir}`;
  await $`rm -f ${join(templateDir, 'package.json')}`;
}

async function sync(templateName: ETemplate): Promise<void> {
  const targetDir = './tmp';
  const repo = `esboot-${templateName}`;
  const repoUrl = `https://github.com/${owner}/${repo}.git`;
  const repoDir = join(targetDir, repo);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  logger.wait(`Cloning from ${repoUrl}...`);
  if (existsSync(repoDir)) {
    await $`rm -rf ${repoDir}`;
  }

  await $`git clone --depth=1 ${repoUrl} ${repoDir}`;
  logger.info(`Successfully cloned to ${repoDir}`);

  const { stdout: commitHash } = await $`cd ${repoDir} && git rev-parse HEAD`;
  logger.info(`Current commit hash: ${commitHash.toString().trim()}`);

  const templateDir = join(process.cwd(), 'templates', templateName);
  await $`rm -rf ${templateDir}`;
  await syncTemplateFiles({ repoDir, templateDir });

  const pkg = await Bun.file(join(repoDir, 'package.json')).json();
  pkg.esbootTemplateGitHash = commitHash.toString().trim();

  await Bun.write(
    join(templateDir, 'package.json.tpl'),
    JSON.stringify(pkg, null, 2),
  );
  logger.info('Successfully upgraded template');

  logger.wait('Cleaning up...');
  await $`rm -rf ${repoDir}`;
  logger.info('Successfully cleaned up');
}

if (import.meta.main) {
  const templateName = process.argv[2];

  if (!supportedTemplate.includes(templateName as ETemplate)) {
    throw new Error(`Not supported template: ${templateName}`);
  }

  sync(templateName as ETemplate)
    .then(() => {
      logger.info('Sync completed');
    })
    .catch((error) => {
      logger.error('Sync failed', error);
      process.exit(1);
    });
}
