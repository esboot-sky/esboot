import { resolve } from 'path';
import { exec } from '@dz-web/esboot-common/execa';

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
