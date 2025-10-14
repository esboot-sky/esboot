import type { Configuration } from '@/cfg';
import { isAbsolute, join } from 'node:path';
import kleur from '@dz-web/esboot-common/kleur';

export function logBrand(cfg: Configuration): void {
  const { version } = cfg;

  console.log(`🍊 ${kleur.bold().magenta(`ESBoot v${version}`)}  \n`);
}

export function absPath(cfg: Configuration, ref: string): string {
  const { cwd } = cfg;

  return isAbsolute(ref) ? ref : join(cwd, ref);
}

export function absListPath(cfg: Configuration, ref: string[]): string[] {
  return ref.map((path: string) => {
    return absPath(cfg, path);
  });
}
