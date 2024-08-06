import { join, isAbsolute } from 'path';

import { writeJSONSync, ensureDirSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

import cfg from '@/cfg';

const absListPath = (ref: string[]): string[] => {
  const { cwd } = cfg.config;

  return ref.map((path: string) => {
    return join(cwd, path);
  });
};

export function generateTypeScriptCfg(basePath: string) {
  const { cwd, alias } = cfg.config;
  const tsconfigJson = require(
    join(basePath, 'typescript/tsconfig-sample.json')
  );

  const _alias: Record<string, string[]> = {};

  for (let k in alias) {
    const rawValue = alias[k];
    const isAbsoluteValue = isAbsolute(rawValue);
    const key = isAbsoluteValue ? k : `${k}/*`;
    const value = isAbsoluteValue ? rawValue : `${rawValue}/*`;

    _alias[key] = [value];
  }

  tsconfigJson.compilerOptions.baseUrl = cwd;
  tsconfigJson.compilerOptions.paths = _alias;
  tsconfigJson.exclude = absListPath(tsconfigJson.exclude);
  tsconfigJson.include = absListPath(tsconfigJson.include);
  tsconfigJson.files = absListPath(tsconfigJson.files);

  const folderPath = join(cacheDir, 'typescript');
  const outoutPath = join(folderPath, 'tsconfig.json');

  ensureDirSync(folderPath);

  writeJSONSync(outoutPath, tsconfigJson, {
    spaces: 2,
  });

  info(`Created Typescript Config: ${outoutPath}.`);
}
