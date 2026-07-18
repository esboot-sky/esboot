import { join } from 'node:path';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';
import { shellEnv } from '../environment';

export function loadEnv({ root }: { root: string }): void {
  const envFile = join(root, '.env');
  const envPaths = [envFile];
  const nodeEnv = shellEnv.get('NODE_ENV');
  if (nodeEnv)
    envPaths.push(`${envFile}.${nodeEnv}`);
  envPaths.push(`${envFile}.local`);

  const fileEnv: Record<string, string> = {};
  const { parsed = {} } = dotEnv.config({
    override: true,
    path: envPaths,
    processEnv: fileEnv,
    quiet: true,
  });
  const providerEnv = Object.fromEntries(
    Object.entries(shellEnv.toObject()).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
  const fileEnvToInject = Object.fromEntries(
    Object.entries(parsed).filter(([key]) => !shellEnv.has(key)),
  );
  const { parsed: expanded = {} } = dotEnvExpand.expand({
    parsed: fileEnvToInject,
    processEnv: {
      ...parsed,
      ...providerEnv,
    },
  });

  shellEnv.assign(expanded);
}
