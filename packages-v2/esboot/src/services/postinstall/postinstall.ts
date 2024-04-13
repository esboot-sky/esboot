import { generateAliasFiles } from '../generate/alias';
import { runExec } from '../exec';

export function runPostInstall(options: Record<string, string>) {
  // esboot exec husky install
  runExec(['husky', 'install']);

  // esboot g-alias
  generateAliasFiles();
}
