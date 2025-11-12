export function getAssetPath(relativePath: string): string {
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/'
  const cleanPublicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath

  return `${cleanPublicPath}${cleanRelativePath}`
}

export default getAssetPath
