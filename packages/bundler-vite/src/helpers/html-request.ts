interface HtmlRequest {
  originalUrl: string;
  headers: {
    accept?: string | string[];
  };
}

export function isHtmlRequest(req: HtmlRequest): boolean {
  const accept = Array.isArray(req.headers.accept)
    ? req.headers.accept.join(',')
    : req.headers.accept;
  const pathname = req.originalUrl.split(/[?#]/, 1)[0];

  return Boolean(accept?.includes('text/html') || pathname.endsWith('.html'));
}
