import type { BabelPlugin, ConfigurationInstance } from '@dz-web/esboot';
import { resolvePathFromUrl } from '@dz-web/esboot-common/helpers';

export function addReactCompiler(cfg: ConfigurationInstance): BabelPlugin | false {
  const { experimental } = cfg.config;
  const { enable, target } = experimental?.reactCompiler || { enable: false, target: '19' };

  if (!enable) {
    return false;
  }

  return [
    resolvePathFromUrl('babel-plugin-react-compiler', import.meta.resolve),
    {
      target,
    },
  ];
}
