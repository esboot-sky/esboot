import { afterEach, describe, expect, it } from 'vitest';

import { addPrefixWithBasePath } from './path';

const originPublicPath = process.env.publicPath;

describe('addPrefixWithBasePath', () => {
  afterEach(() => {
    process.env.publicPath = originPublicPath;
  });

  it('should prepend publicPath before route path', () => {
    process.env.publicPath = '/account-management-center/';

    expect(addPrefixWithBasePath('static/logo.svg')).toBe('/account-management-center/static/logo.svg');
  });

  it('should keep path structure when appending nested route', () => {
    process.env.publicPath = '/base/';

    expect(addPrefixWithBasePath('user/list')).toBe('/base/user/list');
  });
});
