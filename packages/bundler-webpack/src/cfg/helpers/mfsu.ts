import { join } from 'path';
import webpack from 'webpack';
import { MFSU as _MFSU } from '@umijs/mfsu';
import { isFunction, noop } from '@dz-web/esboot-common/lodash';
import { cacheDir } from '@dz-web/esboot-common/constants';
import type { ConfigurationInstance } from '@dz-web/esboot';
import type { AddFunc, CustomWebpackConfiguration } from '@/cfg/types';
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
      strategy: 'normal',
      ...defaultMfsuOpts,
      cwd,
      tmpBase: mfsuCacheDir,
      // Type error?
      implementor: webpack as any,
    });
  }

  return mfsuInstance;
};

export const wrapCfgWithMfsu: (
  ...args: Parameters<AddFunc<{ mfsu: MFSU }>>
) => Promise<CustomWebpackConfiguration> = async (cfg, webpackCfg, options) => {
  const { isDev, useLangJsonPicker } = cfg.config;
  const { mfsu } = options!;

  if (!mfsu || !isDev) return webpackCfg;

  if (useLangJsonPicker) {
    for (const key of Object.keys(webpackCfg.entry)) {
      // EntryDescription
      if (
        typeof webpackCfg.entry[key] === 'object' &&
        'import' in webpackCfg.entry[key]
      ) {
        webpackCfg.entry[key] = webpackCfg.entry[key].import ?? '';
      }
    }
  }

  await mfsu.setWebpackConfig({
    config: webpackCfg,
    depConfig: {},
  });

  return webpackCfg;
};
