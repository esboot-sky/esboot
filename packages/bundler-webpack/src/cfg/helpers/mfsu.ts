import { join } from 'path';
import webpack from 'webpack';
import { MFSU as _MFSU } from '@umijs/mfsu';
import { isFunction, noop } from '@dz-web/esboot-common/lodash';
import { cacheDir } from '@dz-web/esboot-common/constants';
import type { ConfigurationInstance } from '@dz-web/esboot';

import type { BundlerWebpackOptions } from '@/types';

export type MFSU = _MFSU | null;
const mfsuCacheDir = join(cacheDir, './mfsu');
export const createMFSU = (cfg: ConfigurationInstance): MFSU => {
  const { bundlerOptions, isDev, cwd } = cfg.config;
  const { mfsu = true, mfsuOptions } = bundlerOptions as BundlerWebpackOptions;

  let mfsuInstance: MFSU = null;
  if (isDev && mfsu) {
    let defaultMfsuOpts = {};

    if (isFunction(mfsuOptions)) {
      defaultMfsuOpts = mfsuOptions(defaultMfsuOpts);
    }

    mfsuInstance = new _MFSU({
      depBuildConfig: {},
      buildDepWithESBuild: true,
      startBuildWorker: noop as any,
      ...defaultMfsuOpts,
      cwd,
      tmpBase: mfsuCacheDir,
      // Type error?
      implementor: webpack as any,
    });
  }

  return mfsuInstance;
};
