import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/helpers/index.ts',
      'src/utils/index.ts',
      'src/lodash/index.ts',
      'src/fs-extra/index.ts',
      'src/kleur/index.ts',
      'src/execa/index.ts',
      'src/plugin/index.ts',
      'src/cfg/index.ts',
      'src/constants/index.ts',
    ],
  },
});
