import { execSync } from 'node:child_process';
import process from 'node:process';
import kleur from '@dz-web/esboot-common/kleur';

export function checkPnpmVersion(): void {
  let version = '';
  try {
    version = execSync('pnpm -v', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  }
  catch (err) {
    console.error(
      kleur.red('pnpm is not installed or could not be run. esboot requires pnpm >= 10.'),
    );
    process.exit(1);
  }

  const major = Number.parseInt(version.split('.')[0], 10);
  if (Number.isNaN(major) || major < 10) {
    console.error(
      kleur.red(`Your pnpm version ${version} is not supported, please upgrade to 10 or later.`),
    );
    process.exit(1);
  }
}
