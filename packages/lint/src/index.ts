import { resolve } from 'path';
import { exec } from '@dz-web/esboot-common/execa';
import {
  copySync,
  existsSync,
  ensureDirSync,
} from '@dz-web/esboot-common/fs-extra';

export async function lint({ cwd }: { cwd: string }) {
  const args = process.argv.slice(3);
  exec(`${require.resolve('stylelint/bin/stylelint')} **/*.scss ${args}`, {
    onError: () => void 0,
  });
  // Special case for eslint
  exec(`eslint --ext .jsx,.js,.ts,.tsx ${resolve(cwd, 'src')} ${args}`, {
    onError: () => void 0,
  });
}

export function huskySetup({ configRootPath }: { configRootPath: string }) {
  const huskyCfgTarget = resolve(configRootPath, '.husky');
  if (!existsSync(huskyCfgTarget)) {
    ensureDirSync(huskyCfgTarget);
    copySync(resolve(__dirname, '../config/.husky'), huskyCfgTarget);
  }
  exec(`${require.resolve('husky/lib/bin')} install config/.husky`);
}
