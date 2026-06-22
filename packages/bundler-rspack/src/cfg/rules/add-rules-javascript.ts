import type { SwcLoaderOptions } from '@rspack/core';
import type { AddFunc } from '@/cfg/types';
import type { BundlerRspackOptions } from '@/types';
import { isAbsolute, resolve } from 'node:path';
import { resolveLibPath } from '@dz-web/esboot-common/helpers';
import { isRegExp } from '@dz-web/esboot-common/lodash';

const EXTRA_JS_RE = /\.(js|mjs|cjs)$/;
const JSON_RE = /\.json$/;

export const addJavaScriptRules: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, rootPath, bundlerOptions = {}, cwd } = cfg.config;
  const { extraBabelIncludes = [] } = bundlerOptions as BundlerRspackOptions;

  const getExtraBabelIncludes = (): RegExp[] | string[] => {
    return [...extraBabelIncludes].filter(Boolean).map((item) => {
      if (isRegExp(item))
        return item;
      if (isAbsolute(item as string))
        return item;

      // resolve npm package name
      try {
        if ((item as string).startsWith('./')) {
          return resolve(cwd, item as string);
        }

        return resolveLibPath(item as string, import.meta.resolve);
      }
      catch (e: any) {
        if (e.code === 'MODULE_NOT_FOUND') {
          throw new Error(`Cannot resolve extraBabelIncludes: ${item}`, {
            cause: e,
          });
        }
        throw e;
      }
    });
  };

  rspackCfg.module.rules.push({
    test: /\.(j|t)s$/,
    exclude: [
      /[\\/]node_modules[\\/]/,
      /[\\/]packages[\\/].*[\\/]dist[\\/]/,
    ],
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        externalHelpers: false,
        transform: {
          react: {
            runtime: 'automatic',
            development: isDev,
            refresh: isDev,
          },
        },
      },
    } satisfies SwcLoaderOptions,
    type: 'javascript/auto',
  });

  const resolvedExtraBabelIncludes = getExtraBabelIncludes();
  if (resolvedExtraBabelIncludes.length > 0) {
    rspackCfg.module.rules.push({
      test: EXTRA_JS_RE,
      include: resolvedExtraBabelIncludes,
      exclude: [rootPath, JSON_RE],
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          externalHelpers: false,
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      } satisfies SwcLoaderOptions,
      type: 'javascript/auto',
    });
  }
};
