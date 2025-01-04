import type { ConfigurationInstance } from '@dz-web/esboot';
import { isUndefined } from '@dz-web/esboot-common/lodash';

export function addPostcssPluginPx2rem(cfg: ConfigurationInstance) {
  const { px2rem: px2remOptions, isMobile } = cfg.config;
  const { enable: enablePxToRem, ...restOptions } = px2remOptions;

  const enablePxToRemByCompatibility = isUndefined(enablePxToRem)
    ? isMobile
    : enablePxToRem;

  if (!enablePxToRemByCompatibility) return false;

  const pxtorem = require('@alitajs/postcss-plugin-px2rem');

  console.log(restOptions, 'pxtoremCustom');
  
  return pxtorem({
    rootValue: 200,
    unitPrecision: 5,
    propWhiteList: [],
    propBlackList: [],
    exclude: false,
    selectorBlackList: [],
    ignoreIdentifier: false,
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    ...restOptions,
  });
}
