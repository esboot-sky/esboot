import { execa } from 'execa';

interface ExecOptions {
  options?: {
    cwd?: string;
    [key: string]: any;
  };
  onError?: (error: any) => void;
}

export const exec = async (
  args: string,
  { options = {}, onError }: ExecOptions = {}
) => {
  try {
    const result = await execa({
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
