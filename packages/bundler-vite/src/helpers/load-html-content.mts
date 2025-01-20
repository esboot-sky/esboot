import { readFile } from 'node:fs/promises';
import { isUndefined } from '@dz-web/esboot-common/lodash';
import type { SharedConfig } from '@/types.mts';

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
    htmlContent = await readFile(template, 'utf-8');
    templateContentCache.set(template, htmlContent || '');
  }

  htmlContent = htmlContent.replace(
    '</body>',
    `<script src="${entry}" type="module"></script></body>`
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
