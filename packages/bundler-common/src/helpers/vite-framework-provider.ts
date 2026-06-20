export interface ViteFrameworkPluginContext {
  target: 'vite' | 'vitest';
  isDev: boolean;
}

export interface ViteFrameworkProvider {
  getPlugins: (
    context: ViteFrameworkPluginContext,
  ) => unknown[] | Promise<unknown[]>;
  transformFrameworkBundles?: (frameworkBundles: string[]) => string[];
  useReactStyleNamePlugin?: boolean;
}

export interface ViteBundlerOptionsLike {
  frameworkProvider?: ViteFrameworkProvider;
}

export function resolveViteFrameworkProvider(
  bundlerOptions?: ViteBundlerOptionsLike,
): ViteFrameworkProvider | undefined {
  return bundlerOptions?.frameworkProvider;
}

export async function resolveViteFrameworkPlugins(
  bundlerOptions: ViteBundlerOptionsLike | undefined,
  context: ViteFrameworkPluginContext,
): Promise<unknown[] | undefined> {
  const frameworkProvider = resolveViteFrameworkProvider(bundlerOptions);

  if (!frameworkProvider) {
    return undefined;
  }

  return await frameworkProvider.getPlugins(context);
}

export function transformFrameworkBundles(
  bundlerOptions: ViteBundlerOptionsLike | undefined,
  frameworkBundles: string[],
): string[] {
  const frameworkProvider = resolveViteFrameworkProvider(bundlerOptions);

  return frameworkProvider?.transformFrameworkBundles
    ? frameworkProvider.transformFrameworkBundles(frameworkBundles)
    : frameworkBundles;
}

export function shouldUseReactStyleNamePlugin(
  bundlerOptions?: ViteBundlerOptionsLike,
): boolean {
  return resolveViteFrameworkProvider(bundlerOptions)?.useReactStyleNamePlugin !== false;
}
