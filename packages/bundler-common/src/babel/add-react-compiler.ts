import type { BabelPlugin, ConfigurationInstance } from '@dz-web/esboot';
import { join } from 'node:path';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';
import { error, resolvePathFromUrl } from '@dz-web/esboot-common/helpers';

function detectedReactCompilerRuntime(cwd: string): boolean {
  const packageJsonPath = join(cwd, 'node_modules', 'react-compiler-runtime', 'package.json');
  return pathExistsSync(packageJsonPath);
}

export function addReactCompiler(cfg: ConfigurationInstance): BabelPlugin | false {
  const { experimental, cwd } = cfg.config;
  const { enable, target } = experimental?.reactCompiler || { enable: false, target: '19' };

  if (!enable) {
    return false;
  }

  if (target === '18' && !detectedReactCompilerRuntime(cwd)) {
    error('React 18 requires `react-compiler-runtime` package, you can install it by running `pnpm add react-compiler-runtime`');
    return false;
  }

  return [
    resolvePathFromUrl('babel-plugin-react-compiler', import.meta.resolve),
    {
      target,
    },
  ];
}
