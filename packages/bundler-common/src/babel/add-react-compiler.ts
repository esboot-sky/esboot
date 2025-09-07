import type { BabelPlugin, ConfigurationInstance } from '@dz-web/esboot';
import { fileURLToPath } from 'node:url';

const resolvePath = (p: string): string => fileURLToPath(import.meta.resolve(p));
export function addReactCompiler(cfg: ConfigurationInstance): BabelPlugin | false {
  const { experimental } = cfg.config;
  const { enable, target } = experimental?.reactCompiler || { enable: false, target: '19' };

  if (!enable) {
    return false;
  }

  return [
    resolvePath('babel-plugin-react-compiler'),
    {
      target,
    },
  ];
}
