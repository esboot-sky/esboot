interface HtmlRequest {
  originalUrl: string;
  headers: {
    accept?: string | string[];
  };
}

const URL_SUFFIX_RE = /[?#]/;

export function isHtmlRequest(req: HtmlRequest): boolean {
  const accept = Array.isArray(req.headers.accept)
    ? req.headers.accept.join(',')
    : req.headers.accept;
  const pathname = req.originalUrl.split(URL_SUFFIX_RE, 1)[0];

  return Boolean(accept?.includes('text/html') || pathname.endsWith('.html'));
}
