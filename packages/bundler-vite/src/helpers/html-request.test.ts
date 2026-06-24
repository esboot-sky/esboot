import { describe, expect, it } from 'vitest';

import { isHtmlRequest } from './html-request';

describe('isHtmlRequest', () => {
  it('treats explicit html accept headers as html requests', () => {
    expect(isHtmlRequest({ originalUrl: '/anything', headers: { accept: 'text/html' } })).toBe(true);
  });

  it('treats .html urls as html requests even without an html accept header', () => {
    expect(isHtmlRequest({ originalUrl: '/index.html', headers: {} })).toBe(true);
    expect(isHtmlRequest({ originalUrl: '/index.html?from=healthcheck', headers: { accept: '*/*' } })).toBe(true);
  });

  it('does not treat plain asset urls as html requests', () => {
    expect(isHtmlRequest({ originalUrl: '/assets/app.js', headers: { accept: '*/*' } })).toBe(false);
  });

  it('does not treat static asset urls as html requests even if the browser accepts html', () => {
    expect(isHtmlRequest({ originalUrl: '/static/logo.svg', headers: { accept: 'text/html,application/xhtml+xml' } })).toBe(false);
    expect(isHtmlRequest({ originalUrl: '/static/icons/app.png?version=1', headers: { accept: 'text/html,application/xhtml+xml' } })).toBe(false);
    expect(isHtmlRequest({ originalUrl: '/static/test/index.html', headers: { accept: 'text/html,application/xhtml+xml' } })).toBe(false);
  });

  it('respects publicPath when checking html and static urls', () => {
    expect(isHtmlRequest(
      { originalUrl: '/public/client.html', headers: { accept: 'text/html,application/xhtml+xml' } },
      '/public/',
    )).toBe(true);

    expect(isHtmlRequest(
      { originalUrl: '/public/static/logo.svg', headers: { accept: 'text/html,application/xhtml+xml' } },
      '/public/',
    )).toBe(false);
    expect(isHtmlRequest(
      { originalUrl: '/public/static/test/index.html', headers: { accept: 'text/html,application/xhtml+xml' } },
      '/public/',
    )).toBe(false);
  });
});
