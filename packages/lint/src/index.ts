import { resolve } from 'path';

const importExeca = import('execa');

export async function lint(args: string[] = []) {
  const { execa, ExecaError } = await importExeca;

  await execa(
    require.resolve('stylelint/bin/stylelint'),
    ['**/*.scss', ...args],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  try {
    await execa(
      // Special case for eslint
      'eslint',
      ['--ext', '.jsx,.js,.ts,.tsx', resolve(process.cwd(), 'src/'), ...args],
      {
        stdio: 'inherit',
        shell: true,
      }
    );
  } catch (error) {
    if (error instanceof ExecaError) {
      // console.log(error);
    }
  }
}
