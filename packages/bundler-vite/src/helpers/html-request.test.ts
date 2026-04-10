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
});
