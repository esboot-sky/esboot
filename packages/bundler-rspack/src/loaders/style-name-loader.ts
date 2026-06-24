import { transformStyleName } from '@dz-web/esboot-bundler-common';

interface LoaderContext {
  resourcePath: string;
}

/**
 * Rspack/Webpack-compatible loader that transforms JSX `styleName` attributes
 * into `className` lookups and synthesises named CSS-Module variables for
 * side-effect scss imports (`import './x.scss'`).
 *
 * This reuses the same `transformStyleName` logic from `bundler-common` that
 * the Vite adapter uses, keeping behaviour identical across all bundlers.
 */
export default function styleNameLoader(
  this: LoaderContext,
  source: string,
): string {
  const result = transformStyleName(source, this.resourcePath);
  return result ? result.code : source;
}
