import { join } from 'node:path';
import process from 'node:process';

interface ResolveIntentOptions {
  alias: Record<string, string>;
  cwd?: string;
  includeMainFields?: boolean;
}

const DEFAULT_EXTENSIONS = [
  '.wasm',
  '.mjs',
  '.cjs',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
];

export function createResolveIntent(options: ResolveIntentOptions) {
  const { alias, cwd = process.cwd(), includeMainFields = false } = options;
  const resolvedAlias: Record<string, string> = {};

  for (const key in alias) {
    resolvedAlias[key] = join(cwd, `./${alias[key]}/`);
  }

  return {
    alias: resolvedAlias,
    extensions: DEFAULT_EXTENSIONS,
    mainFields: includeMainFields ? ['module', 'browser', 'main'] : undefined,
  };
}
