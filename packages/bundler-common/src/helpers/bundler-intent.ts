import { resolve } from 'node:path';

import { DEFAULT_OUTPUT_PATH } from '@dz-web/esboot-common/constants';

interface OutputIntentOptions {
  cwd: string;
  isDev: boolean;
  publicPath: string;
  outputPath?: string;
}

interface DevtoolIntentOptions {
  isDev: boolean;
  sourceMap?: boolean;
}

export function createOutputIntent(options: OutputIntentOptions): {
  publicPath: string;
  clean: boolean;
  path: string;
  filename: string;
} {
  const { cwd, isDev, publicPath, outputPath } = options;

  return {
    publicPath,
    clean: !isDev,
    path: resolve(cwd, outputPath || DEFAULT_OUTPUT_PATH),
    filename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
  };
}

export function resolveDevtoolIntent(options: DevtoolIntentOptions): string | undefined {
  const { isDev, sourceMap } = options;

  if (sourceMap) {
    return 'source-map';
  }

  if (isDev) {
    return 'cheap-module-source-map';
  }

  return undefined;
}

export function resolveExternalsIntent<T>(externals?: T): T | undefined {
  return externals || undefined;
}
