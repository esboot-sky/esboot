import type { SharedConfig } from '@/types';
import { existsSync, readFileSync } from 'node:fs';
import { defaultTemplate } from '@dz-web/esboot-bundler-common';
import { isUndefined } from '@dz-web/esboot-common/lodash';

const templateContentCache = new Map<string, string>();
const entryContentCache = new Map<string, string>();
const WINDOWS_PATH_RE = /\\/g;

export async function loadHtmlContent(pageName: string, pages: SharedConfig['pages'], { isDev = true }: { isDev?: boolean } = {}): Promise<string | null> {
  const pageEntryInfo = pages[pageName];
  if (!pageEntryInfo)
    return null;

  const { entry, template, title } = pageEntryInfo;

  if (isDev) {
    const entryContent = entryContentCache.get(entry);
    if (entryContent)
      return entryContent;
  }

  let htmlContent = templateContentCache.get(template);
  if (!htmlContent) {
    if (existsSync(template)) {
      htmlContent = readFileSync(template, 'utf-8');
    }
    else {
      htmlContent = defaultTemplate;
    }
    templateContentCache.set(template, htmlContent || '');
  }

  htmlContent = htmlContent.replace(
    '</body>',
    `<script src="${entry.replace(WINDOWS_PATH_RE, '/')}" type="module"></script></body>`,
  );
  if (!isUndefined(title)) {
    htmlContent = htmlContent.replace(
      '<head>',
      `<head><title>${title}</title>`,
    );
  }

  if (isDev) {
    entryContentCache.set(entry, htmlContent);
  }

  return htmlContent;
}
