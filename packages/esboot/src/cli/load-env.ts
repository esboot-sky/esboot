import { join } from 'path';
import { existsSync } from 'fs';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

export function loadEnv({ root }: { root: string }) {
  const load = (dotenvFile: string) => {
    if (existsSync(dotenvFile)) {
      dotEnvExpand.expand(
        dotEnv.config({
          override: true,
          path: dotenvFile,
        })
      );
    }
  };

  const envFile = join(root, '.env');

  const willLoadEnvs = [envFile, `${envFile}.local`];

  willLoadEnvs.forEach((envFilePath) => {
    load(envFilePath);
  });
}
