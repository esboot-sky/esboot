import { join } from 'node:path';
import { existsSync } from 'node:fs';
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

  for (const envFilePath of willLoadEnvs) {
    load(envFilePath);
  }
}
