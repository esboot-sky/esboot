import type { PageDefinition } from '@dz-web/esboot';
import type { SharedConfig } from '@/types';
import { resolve } from 'node:path';

const ROOT_CONTAINER_RE = /<div id="root"><\/div>/;
const MODULE_PRELOAD_RE = /<link\s[^>]*rel=["']modulepreload["'][^>]*>/g;
const MODULE_SCRIPT_RE = /<script\s[^>]*type=["']module["'][^>]*>.*?<\/script>/gs;

interface RenderedSsgResult {
  html: string;
  hydrate: boolean;
}

interface InjectSsgHtmlOptions {
  appHtml: string;
  hydrate: boolean;
}

interface PrerenderSsgPagesOptions {
  outDir: string;
  pages: SharedConfig['pages'];
  loadModule: (id: string) => Promise<Record<string, unknown>>;
  readSource?: (id: string) => string;
  readHtml: (id: string) => string;
  writeHtml: (id: string, html: string) => void;
}

interface RenderSsgHtmlForPageOptions {
  html: string;
  page: SharedConfig['pages'][string];
  loadModule: (id: string) => Promise<Record<string, unknown>>;
  readSource?: (id: string) => string;
  skipSourceCheck?: boolean;
}

// eslint-disable-next-line no-new-func
const loadReactDomServer = new Function(
  'return import("react-dom/server")',
) as () => Promise<typeof import('react-dom/server')>;
const SSG_SIGNATURE_RE = /\bssg\s*:/;

export function resolvePageDefinition(mod: Record<string, unknown>): PageDefinition | null {
  const candidate = mod.default;

  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  return candidate as PageDefinition;
}

export async function renderSsgResult(page: PageDefinition): Promise<RenderedSsgResult> {
  const ssg = page.ssg;

  if (!ssg?.render) {
    throw new Error('SSG render function is required when ssg is enabled.');
  }

  const rendered = await ssg.render();
  if (typeof rendered === 'string') {
    return {
      html: rendered,
      hydrate: ssg.hydrate !== false,
    };
  }

  if (rendered && typeof rendered === 'object' && 'html' in rendered && typeof rendered.html === 'string') {
    return {
      html: rendered.html,
      hydrate: ssg.hydrate !== false,
    };
  }

  const { renderToStaticMarkup } = await loadReactDomServer();

  return {
    html: renderToStaticMarkup(rendered as any),
    hydrate: ssg.hydrate !== false,
  };
}

export function injectSsgHtml(html: string, options: InjectSsgHtmlOptions): string {
  const { appHtml, hydrate } = options;
  let output = html.replace(ROOT_CONTAINER_RE, `<div id="root">${appHtml}</div>`);

  if (!hydrate) {
    output = output
      .replace(MODULE_PRELOAD_RE, '')
      .replace(MODULE_SCRIPT_RE, '');
  }

  return output;
}

function isSsgCandidate(source: string | undefined): boolean {
  if (!source) {
    return true;
  }

  return SSG_SIGNATURE_RE.test(source);
}

async function resolveRenderedSsgPage(
  page: SharedConfig['pages'][string],
  loadModule: (id: string) => Promise<Record<string, unknown>>,
  readSource?: (id: string) => string,
  skipSourceCheck = false,
): Promise<RenderedSsgResult | null> {
  if (!skipSourceCheck && !isSsgCandidate(readSource?.(page.sourceEntry))) {
    return null;
  }

  const mod = await loadModule(page.sourceEntry);
  const definition = resolvePageDefinition(mod);

  if (!definition?.ssg?.enable) {
    return null;
  }

  return renderSsgResult(definition);
}

export async function renderSsgHtmlForPage(options: RenderSsgHtmlForPageOptions): Promise<string> {
  const {
    html,
    page,
    loadModule,
    readSource,
    skipSourceCheck = false,
  } = options;

  const rendered = await resolveRenderedSsgPage(
    page,
    loadModule,
    readSource,
    skipSourceCheck,
  );

  if (!rendered) {
    return html;
  }

  return injectSsgHtml(html, {
    appHtml: rendered.html,
    hydrate: rendered.hydrate,
  });
}

export async function prerenderSsgPages(options: PrerenderSsgPagesOptions): Promise<void> {
  const { outDir, pages, loadModule, readSource, readHtml, writeHtml } = options;

  for (const [pageName, page] of Object.entries(pages)) {
    const rendered = await resolveRenderedSsgPage(
      page,
      loadModule,
      readSource,
    );

    if (!rendered) {
      continue;
    }

    const htmlPath = resolve(outDir, `${pageName}.html`);
    const html = readHtml(htmlPath);

    writeHtml(htmlPath, injectSsgHtml(html, {
      appHtml: rendered.html,
      hydrate: rendered.hydrate,
    }));
  }
}
