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
const DEFAULT_MAIN_FIELDS = ['module', 'browser', 'main'];

export function createResolveIntent(options: ResolveIntentOptions): {
  alias: Record<string, string>;
  extensions: string[];
  mainFields?: string[];
} {
  const { alias, cwd = process.cwd(), includeMainFields = false } = options;
  const resolvedAlias: Record<string, string> = {};

  for (const key in alias) {
    resolvedAlias[key] = join(cwd, `./${alias[key]}/`);
  }

  const result: {
    alias: Record<string, string>;
    extensions: string[];
    mainFields?: string[];
  } = {
    alias: resolvedAlias,
    extensions: DEFAULT_EXTENSIONS,
  };

  if (includeMainFields) {
    result.mainFields = DEFAULT_MAIN_FIELDS;
  }

  return result;
}
