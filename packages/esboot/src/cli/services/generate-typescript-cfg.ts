import { join } from 'path';

import { writeJSONSync, ensureDirSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';

import cfg from '@/cfg';

const absListPath = (ref: string[]): string[] => {
  const { cwd } = cfg.compileTimeCfg;

  return ref.map((path: string) => {
    return join(cwd, path);
  });
};

export function generateTypeScriptCfg(basePath: string) {
  const { cwd } = cfg.compileTimeCfg;
  const tsconfigJson = require(
    join(basePath, 'typescript/tsconfig-sample.json')
  );

  const _alias: Record<string, string[]> = {};

  // console.log(cfg.compileTimeCfg, '<-- cfg');
  // for (let k in alias) {
  //   const rawValue = alias[k];
  //   const isAbsoluteValue = isAbsolute(rawValue);
  //   // FIX: Use Options
  //   const key = isAbsoluteValue ? k : `${k}/*`;
  //   const value = isAbsoluteValue ? rawValue : `${rawValue}/*`;

  //   _alias[key] = [value];
  // }

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
  // info(`Created File: ${outoutPath}.`);
  console.log(outoutPath, tsconfigJson, '<-- tsconfigJson');
}
