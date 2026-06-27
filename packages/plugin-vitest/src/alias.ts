import { resolveLibPath } from '@dz-web/esboot-common/helpers';

export const alias = {
  'vitest': resolveLibPath('vitest', import.meta.resolve),
  '@testing-library/react': resolveLibPath('@testing-library/react', import.meta.resolve),
  '@testing-library/user-event': resolveLibPath('@testing-library/user-event', import.meta.resolve),
};
