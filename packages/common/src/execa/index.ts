const importExeca = import('execa');

interface ExecOptions {
  options?: {
    cwd?: string;
    [key: string]: unknown;
  };
  onError?: (error: unknown) => void;
}

export const exec = async (
  args: string,
  { options = {}, onError }: ExecOptions = {}
) => {
  const { $ } = await importExeca;

  try {
    const result = await $({
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
      ...options,
    })`${args}`;

    return result;
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
};
