interface CacheIntentOptions {
  isDev: boolean;
  isCIBuild: boolean;
  buildCache?: boolean;
}

export function createRuntimeOptimizationIntent() {
  return {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  };
}

export function shouldEnableCacheIntent(options: CacheIntentOptions): boolean {
  const { isDev, isCIBuild, buildCache = false } = options;

  if (isDev) {
    return false;
  }

  if (isCIBuild && !buildCache) {
    return false;
  }

  return true;
}
