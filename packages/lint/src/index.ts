import { resolve } from 'path';
import { exec } from '@dz-web/esboot-common/execa';
import {
  copyFileSync,
  existsSync,
  ensureDirSync,
} from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common';

export async function lint() {
  const args = process.argv.slice(3);
  exec(`${require.resolve('stylelint/bin/stylelint')} **/*.scss ${args}`, {
    onError: () => void 0,
  });
  // Special case for eslint
  exec(
    `eslint --ext .jsx,.js,.ts,.tsx ${resolve(process.cwd(), 'src')} ${args}`,
    {
      onError: () => void 0,
    }
  );
}

export function huskySetup() {
  const huskyCfgTarget = resolve(cacheDir, '.husky');
  if (!existsSync(huskyCfgTarget)) {
    ensureDirSync(huskyCfgTarget);
    copyFileSync(resolve(__dirname, '../config/.husky'), huskyCfgTarget);
  }
  exec(`${require.resolve('husky/lib/bin')} install ${huskyCfgTarget}`);
}
