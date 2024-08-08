const importExeca = import('execa');

interface ExecOptions {
  options?: Record<string, any>;
  onError?: (error: any) => void;
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
