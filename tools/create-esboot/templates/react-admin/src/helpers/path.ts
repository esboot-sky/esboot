export function addPrefixWithBasePath(path: string) {
  // eslint-disable-next-line node/prefer-global/process
  return `${process.env.publicPath}${path}`;
}
