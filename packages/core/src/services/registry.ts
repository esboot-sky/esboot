import { join } from 'path';
import { existsSync } from 'fs';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';
import esbootConfig from '@@/config';

import { processPrepare } from './prepare';

function loadEnv({ root }: { root: string }) {
  const load = (dotenvFile: string) => {
    if (existsSync(dotenvFile)) {
      dotEnvExpand.expand(
        dotEnv.config({
          path: dotenvFile,
        })
      );
    }
  };

  const envFile = join(root, '.env');

  const willLoadEnvs = [
    envFile,
    `${envFile}.${process.env.NODE_ENV}`,
    `${envFile}.local`,
  ];
  willLoadEnvs.forEach((envFilePath) => {
    load(envFilePath);
  });
}

export const registry = async ({ root }: { root: string }) => {
  loadEnv({ root });
  await processPrepare();
  await esbootConfig.init();
};
