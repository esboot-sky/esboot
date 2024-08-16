import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/constants/index.ts',
      'src/helpers/index.ts',
      'src/utils/index.ts',
      'src/lodash/index.ts',
      'src/fs-extra/index.ts',
      'src/kleur/index.ts',
      'src/execa/index.ts',
    ],
  },
});
