import { fileURLToPath } from "node:url";

const resolvePath = (p: string) => fileURLToPath(import.meta.resolve(p));

export const getCssHashRule = () => '[local]__[contenthash:base64:8]';
export const getStyleLoader = (): Record<string, any> => ({
  loader: resolvePath('style-loader'),
  options: {
    esModule: true,
  },
});

export const getMiniCssExtractPluginOptions = (): Record<string, any> => ({
  emit: true,
  esModule: true,
});

export const getCssLoaderOptions = (): Record<string, any> => ({
  esModule: true,
  import: true,
});
