import type { Configuration, TailwindVersion } from './types';

export interface TailwindConfig {
  enable: boolean;
  version: TailwindVersion;
  separateImports: boolean;
}

export function resolveTailwindConfig(cfg: Pick<Configuration, 'css'>): TailwindConfig {
  const tailwind = cfg.css?.tailwind;

  return {
    enable: tailwind?.enable ?? true,
    version: tailwind?.version ?? 'next',
    separateImports: tailwind?.separateImports ?? false,
  };
}
