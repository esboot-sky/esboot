import { transformStyleName } from '@dz-web/esboot-bundler-common';

interface LoaderContext {
  resourcePath: string;
}

export default function styleNameLoader(
  this: LoaderContext,
  source: string,
): string {
  const result = transformStyleName(source, this.resourcePath);
  return result ? result.code : source;
}
