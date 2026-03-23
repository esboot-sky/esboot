export function addPrefixWithBasePath(path: string) {
  return `${process.env.publicPath}${path}`;
}
