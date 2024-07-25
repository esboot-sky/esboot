import { DEFAULT_DEV_PORT } from '@dz-web/esboot-common/constants';
import type { UserOptions } from './types';

export const defaultUserOpts = {
  bundler: null,
  analyze: false,
  outputPath: 'dist',
  useLangJsonPicker: true,
  server: {
    open: false,
    port: DEFAULT_DEV_PORT,
  },
} satisfies UserOptions;
