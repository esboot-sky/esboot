const FRAMEWORK_BUNDLES = [
  // React Series
  'react-dom',
  'react',
];

export const mergeFrameworkBundles = (
  frameworkBundles: string[] = []
): string[] => {
  return [...FRAMEWORK_BUNDLES, ...frameworkBundles];
};
