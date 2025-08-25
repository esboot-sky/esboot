import { fileURLToPath } from 'node:url';
import type { ConfigurationInstance, BabelPlugin } from '@dz-web/esboot';

const resolvePath = (p: string) => fileURLToPath(import.meta.resolve(p));
export const addReactCompiler = (cfg: ConfigurationInstance): BabelPlugin | false => {
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
};
