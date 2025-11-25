import type { ConfigurationInstance } from '@dz-web/esboot';
import { isUndefined } from '@dz-web/esboot-common/lodash';

export async function addPostcssPluginPx2rem(cfg: ConfigurationInstance): Promise<any | false> {
  const { px2rem: px2remOptions, isMobile } = cfg.config;
  const { enable: enablePxToRem, ...restOptions } = px2remOptions;

  const enablePxToRemByCompatibility = isUndefined(enablePxToRem)
    ? isMobile
    : enablePxToRem;

  if (!enablePxToRemByCompatibility)
    return false;

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
