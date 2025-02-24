import { readFileSync, existsSync } from 'node:fs';
import { isUndefined } from '@dz-web/esboot-common/lodash';
import type { SharedConfig } from '@/types.mts';
import { defaultTemplate } from '@dz-web/esboot-bundler-common';

const templateContentCache = new Map<string, string>();
const entryContentCache = new Map<string, string>();

export const loadHtmlContent = async (
  pageName: string,
  pages: SharedConfig['pages'],
  { isDev = true }: { isDev?: boolean } = {}
) => {
  const pageEntryInfo = pages[pageName];
  if (!pageEntryInfo) return null;

  const { entry, template, title } = pageEntryInfo;

  if (isDev) {
    const entryContent = entryContentCache.get(entry);
    if (entryContent) return entryContent;
  }

  let htmlContent = templateContentCache.get(template);
  if (!htmlContent) {
    if (existsSync(template)) {
      htmlContent = readFileSync(template, 'utf-8');
    } else {
      htmlContent = defaultTemplate;
    }
    templateContentCache.set(template, htmlContent || '');
  }

  htmlContent = htmlContent.replace(
    '</body>',
    `<script src="${entry.replace(/\\/g, '/')}" type="module"></script></body>`
  );
  if (!isUndefined(title)) {
    htmlContent = htmlContent.replace(
      '<head>',
      `<head><title>${title}</title>`
    );
  }

  if (isDev) {
    entryContentCache.set(entry, htmlContent);
  }

  return htmlContent;
};
