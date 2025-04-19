import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '@umijs/utils';
import { $ } from 'bun';

const owner = 'esboot-sky';
const supportedTemplate = ['mp', 'sp', 'demo'];
const templateName = process.argv[2];

if (!supportedTemplate.includes(templateName)) {
  throw new Error(`Not supported template: ${templateName}`);
}

const repo = `esboot-react-${templateName}`;

async function sync() {
  const targetDir = './tmp';
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
  logger.wait('Starting to upgrade template...');
  await $`rsync -av --exclude=package.json --exclude=".git" --exclude="pnpm-lock.yaml" --exclude="pnpm-workspace.yaml" ${repoDir}/ ${templateDir}`;

  const pkg = await Bun.file(join(repoDir, 'package.json')).json();
  pkg.esbootTemplateGitHash = commitHash.toString().trim();

  await Bun.write(
    join(templateDir, 'package.json.tpl'),
    JSON.stringify(pkg, null, 2)
  );
  logger.info('Successfully upgraded template');

  logger.wait('Cleaning up...');
  await $`rm -rf ${repoDir}`;
  logger.info('Successfully cleaned up');
}

sync().then(console.log).catch(console.error);
