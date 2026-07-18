import { join } from 'node:path';
import process from 'node:process';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

export function loadEnv({ root }: { root: string }): void {
  const envFile = join(root, '.env');
  const envPaths = [envFile];
  if (process.env.NODE_ENV)
    envPaths.push(`${envFile}.${process.env.NODE_ENV}`);
  envPaths.push(`${envFile}.local`);

  const fileEnv: Record<string, string> = {};
  const { parsed = {} } = dotEnv.config({
    override: true,
    path: envPaths,
    processEnv: fileEnv,
    quiet: true,
  });
  const shellEnv = process.env as Record<string, string>;
  const fileEnvToInject = Object.fromEntries(
    Object.entries(parsed).filter(([key]) => !Object.hasOwn(shellEnv, key)),
  );
  const { parsed: expanded = {} } = dotEnvExpand.expand({
    parsed: fileEnvToInject,
    processEnv: {
      ...parsed,
      ...shellEnv,
    },
  });

  Object.assign(process.env, expanded);
}
