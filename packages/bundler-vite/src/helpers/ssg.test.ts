import { definePage } from '@dz-web/esboot';
import { describe, expect, it, vi } from 'vitest';

import {
  injectSsgHtml,
  prerenderSsgPages,
  renderSsgHtmlForPage,
  renderSsgResult,
  resolvePageDefinition,
} from './ssg';

describe('vite ssg helpers', () => {
  it('resolves page definitions from a default export', () => {
    const page = definePage({
      title: 'Docs',
      ssg: {
        enable: true,
        render: () => '<article>docs</article>',
      },
    });

    expect(resolvePageDefinition({ default: page })).toBe(page);
  });

  it('renders string ssg output and preserves hydrate by default', async () => {
    await expect(renderSsgResult(definePage({
      ssg: {
        enable: true,
        render: () => '<article>docs</article>',
      },
    }))).resolves.toEqual({
      html: '<article>docs</article>',
      hydrate: true,
    });
  });

  it('injects prerendered html and strips client module tags when hydrate is disabled', () => {
    const html = injectSsgHtml(
      '<html><head><link rel="modulepreload" href="/assets/page.js"></head><body><div id="root"></div><script type="module" src="/assets/page.js"></script></body></html>',
      {
        appHtml: '<article>docs</article>',
        hydrate: false,
      },
    );

    expect(html).toContain('<div id="root"><article>docs</article></div>');
    expect(html).not.toContain('modulepreload');
    expect(html).not.toContain('<script type="module"');
  });

  it('prerenders only pages with ssg enabled', async () => {
    const readHtml = vi.fn(() => '<html><body><div id="root"></div><script type="module" src="/assets/page.js"></script></body></html>');
    const writeHtml = vi.fn();
    const loadModule = vi.fn(async (id: string) => {
      if (id.endsWith('docs.entry.tsx')) {
        return {
          default: definePage({
            title: 'Docs',
            ssg: {
              enable: true,
              hydrate: false,
              render: () => '<article>docs</article>',
            },
          }),
        };
      }

      return {
        default: definePage({
          title: 'Client page',
        }),
      };
    });

    await prerenderSsgPages({
      outDir: '/repo/dist',
      pages: {
        docs: {
          entry: '/src/docs.entry.tsx',
          sourceEntry: '/repo/src/docs.entry.tsx',
          template: '/repo/config/template/index.html',
          title: 'Docs',
        },
        client: {
          entry: '/src/client.entry.tsx',
          sourceEntry: '/repo/src/client.entry.tsx',
          template: '/repo/config/template/index.html',
          title: 'Client',
        },
      },
      loadModule,
      readHtml,
      writeHtml,
    });

    expect(loadModule).toHaveBeenCalledTimes(2);
    expect(readHtml).toHaveBeenCalledTimes(1);
    expect(writeHtml).toHaveBeenCalledWith(
      '/repo/dist/docs.html',
      expect.stringContaining('<div id="root"><article>docs</article></div>'),
    );
  });

  it('skips loading modules that do not look like ssg entries', async () => {
    const readHtml = vi.fn(() => '<html><body><div id="root"></div></body></html>');
    const writeHtml = vi.fn();
    const loadModule = vi.fn(async () => ({
      default: definePage({
        title: 'Docs',
        ssg: {
          enable: true,
          render: () => '<article>docs</article>',
        },
      }),
    }));
    const readSource = vi.fn((id: string) => {
      if (id.endsWith('docs.entry.tsx')) {
        return 'export default { ssg: { enable: true, render: () => "<article>docs</article>" } };';
      }

      return 'generatePage(<App />); export default { title: "Client page" };';
    });

    await prerenderSsgPages({
      outDir: '/repo/dist',
      pages: {
        docs: {
          entry: '/src/docs.entry.tsx',
          sourceEntry: '/repo/src/docs.entry.tsx',
          template: '/repo/config/template/index.html',
          title: 'Docs',
        },
        client: {
          entry: '/src/client.entry.tsx',
          sourceEntry: '/repo/src/client.entry.tsx',
          template: '/repo/config/template/index.html',
          title: 'Client',
        },
      },
      loadModule,
      readSource,
      readHtml,
      writeHtml,
    });

    expect(readSource).toHaveBeenCalledTimes(2);
    expect(loadModule).toHaveBeenCalledTimes(1);
    expect(loadModule).toHaveBeenCalledWith('/repo/src/docs.entry.tsx');
  });

  it('renders dev html for a hydratable ssg page', async () => {
    const loadModule = vi.fn(async () => ({
      default: definePage({
        title: 'Docs',
        ssg: {
          enable: true,
          hydrate: true,
          render: () => '<article>docs</article>',
        },
      }),
    }));

    await expect(renderSsgHtmlForPage({
      html: '<html><body><div id="root"></div><script type="module" src="/src/docs.entry.tsx"></script></body></html>',
      page: {
        entry: '/src/docs.entry.tsx',
        sourceEntry: '/repo/src/docs.entry.tsx',
        template: '/repo/config/template/index.html',
        title: 'Docs',
      },
      loadModule,
      readSource: () => 'export default { ssg: { enable: true, render: () => "<article>docs</article>" } };',
    })).resolves.toContain('<div id="root"><article>docs</article></div>');
  });

  it('leaves dev html unchanged for non-ssg pages', async () => {
    const html = '<html><body><div id="root"></div><script type="module" src="/src/client.entry.tsx"></script></body></html>';
    const loadModule = vi.fn();

    await expect(renderSsgHtmlForPage({
      html,
      page: {
        entry: '/src/client.entry.tsx',
        sourceEntry: '/repo/src/client.entry.tsx',
        template: '/repo/config/template/index.html',
        title: 'Client',
      },
      loadModule,
      readSource: () => 'generatePage(<App />); export default { title: "Client page" };',
    })).resolves.toBe(html);

    expect(loadModule).not.toHaveBeenCalled();
  });
});
