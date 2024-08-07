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
    return $({ stdio: 'inherit', shell: true, ...options })`${args}`;
  } catch (error) {
    console.log(onError, 'onError');

    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
};
