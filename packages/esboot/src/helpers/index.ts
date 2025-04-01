import { join, isAbsolute } from 'node:path';
import kleur from '@dz-web/esboot-common/kleur';
import type { Configuration } from '@/cfg/types';

export function logBrand(cfg: Configuration) {
  const { version } = cfg;

  console.log(`⛵️ ${kleur.bold().magenta(`ESBoot v${version}`)}  \n`);
}

export const absPath = (cfg: Configuration, ref: string): string => {
  const { cwd } = cfg;

  return isAbsolute(ref) ? ref : join(cwd, ref);
};

export const absListPath = (cfg: Configuration, ref: string[]): string[] => {
  return ref.map((path: string) => {
    return absPath(cfg, path);
  });
};
