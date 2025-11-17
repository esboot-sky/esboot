const FRAMEWORK_BUNDLES = [
  // React Series
  'react-dom',
  'react',
  'react-intl',
  'react-router',
  'react-router-dom',
];

export function mergeFrameworkBundles(frameworkBundles: string[] = []): string[] {
  return [...FRAMEWORK_BUNDLES, ...frameworkBundles];
}
