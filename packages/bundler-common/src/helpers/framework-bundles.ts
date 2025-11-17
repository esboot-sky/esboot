const FRAMEWORK_BUNDLES = [
  'react-dom',
  'react',
];

export function mergeFrameworkBundles(frameworkBundles: string[] = []): string[] {
  return [...FRAMEWORK_BUNDLES, ...frameworkBundles];
}
