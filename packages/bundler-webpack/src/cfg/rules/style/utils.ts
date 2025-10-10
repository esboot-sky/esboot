import { createResolvePath } from '@dz-web/esboot-common/helpers';

const resolvePath = createResolvePath(import.meta.resolve);

export const getCssHashRule = (): string => '[local]__[contenthash:base64:8]';
export function getStyleLoader(): Record<string, any> {
  return {
    loader: resolvePath('style-loader'),
    options: {
      esModule: true,
    },
  };
}

export function getMiniCssExtractPluginOptions(): Record<string, any> {
  return {
    emit: true,
    esModule: true,
  };
}

export function getCssLoaderOptions(): Record<string, any> {
  return {
    esModule: true,
    import: true,
  };
}
