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

  const { mode } = process.env;
  const envFile = join(root, '.env');

  const willLoadEnvs = [
    envFile,
    mode && `${envFile}.${mode}`,
    `${envFile}.local`,
  ].filter(Boolean) as string[];

  for (const envFilePath of willLoadEnvs) {
    load(envFilePath);
  }
}
