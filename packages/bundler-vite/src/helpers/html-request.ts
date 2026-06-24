interface HtmlRequest {
  originalUrl: string;
  headers: {
    accept?: string | string[];
  };
}

const URL_SUFFIX_RE = /[?#]/;
const STATIC_PREFIX = '/static/';

export function normalizePublicPath(publicPath?: string): string {
  if (!publicPath || publicPath === '/') {
    return '/';
  }

  const withLeadingSlash = publicPath.startsWith('/') ? publicPath : `/${publicPath}`;

  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

export function stripPublicPath(pathname: string, publicPath?: string): string {
  const normalizedPublicPath = normalizePublicPath(publicPath);

  if (normalizedPublicPath === '/' || !pathname.startsWith(normalizedPublicPath)) {
    return pathname;
  }

  const strippedPath = pathname.slice(normalizedPublicPath.length);

  return strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`;
}

export function isHtmlRequest(req: HtmlRequest, publicPath?: string): boolean {
  const accept = Array.isArray(req.headers.accept)
    ? req.headers.accept.join(',')
    : req.headers.accept;
  const pathname = stripPublicPath(req.originalUrl.split(URL_SUFFIX_RE, 1)[0], publicPath);

  if (pathname === '/static' || pathname.startsWith(STATIC_PREFIX)) {
    return false;
  }

  if (pathname.endsWith('.html')) {
    return true;
  }

  return Boolean(accept?.includes('text/html'));
}
