import type { ConfigurationInstance } from '@dz-web/esboot';
import { isUndefined } from '@dz-web/esboot-common/lodash';

export function normalizeExclude(exclude?: any): any {
  if (exclude === false) return false;
  if (!exclude) return undefined;
  if (Array.isArray(exclude)) {
    if (exclude.length === 0) return undefined;
    if (exclude.length === 1) return normalizeExclude(exclude[0]);
    const pattern = exclude
      .map((item) => {
        if (item instanceof RegExp) {
          return item.source;
        }
        return item.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
      })
      .join('|');
    return new RegExp(pattern);
  }
  return exclude;
}

export async function addPostcssPluginPx2rem(cfg: ConfigurationInstance): Promise<any | false> {
  const { px2rem: px2remOptions, isMobile } = cfg.config;
  const { enable: enablePxToRem, ...restOptions } = px2remOptions;

  const enablePxToRemByCompatibility = isUndefined(enablePxToRem)
    ? isMobile
    : enablePxToRem;

  if (!enablePxToRemByCompatibility)
    return false;

  if (restOptions.exclude !== undefined) {
    restOptions.exclude = normalizeExclude(restOptions.exclude);
  }

  // @ts-ignore
  return import('@alitajs/postcss-plugin-px2rem').then(({ default: plugin }) =>
    plugin({
      rootValue: 200,
      unitPrecision: 5,
      propWhiteList: [],
      propBlackList: [],
      exclude: ['node_modules'],
      selectorBlackList: [],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      ...restOptions,
    }),
  );
}
