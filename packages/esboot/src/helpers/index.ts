import kleur from '@dz-web/esboot-common/kleur';
import type { Configuration } from '@/cfg/types';

export function logBrand(cfg: Configuration) {
  const { version } = cfg;

  console.log(`⛵️ ${kleur.bold().magenta(`ESBoot v${version}`)}  \n`);
}
