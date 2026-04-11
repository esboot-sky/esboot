import SSGDemoPage from '@pc/modules/ssg-demo';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('pc browser ssg demo entry', () => {
  it('exports a hydratable ssg page definition', async () => {
    document.body.innerHTML = `<div id="root">${renderToStaticMarkup(<SSGDemoPage />)}</div>`;

    const mod = await import('./ssg-demo.entry');
    const page = await mod.default.ssg.render();

    expect(mod.default).toMatchObject({
      title: 'pc-browser-ssg-demo',
      template: 'disable-rem',
      ssg: {
        enable: true,
        hydrate: true,
      },
    });

    expect(page).toBeTruthy();
    expect(renderToStaticMarkup(page)).toContain('hydrate counter');
  });
});
