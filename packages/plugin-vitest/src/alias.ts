import { fileURLToPath } from 'node:url';

function resolveLibPath(p: string): string {
  return fileURLToPath(import.meta.resolve(p));
}

export const alias = {
  'vitest': resolveLibPath('vitest'),
  '@testing-library/react': resolveLibPath('@testing-library/react'),
  '@testing-library/user-event': resolveLibPath('@testing-library/user-event'),
};
