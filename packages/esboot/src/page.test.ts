import { describe, expect, it } from 'vitest';

import { definePage } from './page';

describe('definePage', () => {
  it('returns the page definition unchanged', () => {
    const page = {
      title: 'Docs',
      ssg: {
        enable: true,
        hydrate: false,
        render: () => '<article>docs</article>',
      },
    };

    expect(definePage(page)).toBe(page);
  });
});
