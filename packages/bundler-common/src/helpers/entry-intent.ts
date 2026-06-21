import { join } from 'node:path';

interface ResolveTemplateRootPathOptions {
  configRootPath: string;
  MPConfiguration: {
    configRootPathOfPlatfrom: string;
  } | null;
  isSP: boolean;
}

interface CreateEntryValueIntentOptions {
  chunkName: string;
  entry: string;
  enableLangJsonPicker: boolean;
}

interface CreateHtmlPageIntentOptions {
  chunkName: string;
  title: string;
  template: string;
  templateRootPath: string;
  isDev: boolean;
}

export function resolveTemplateRootPath(options: ResolveTemplateRootPathOptions): string {
  const { configRootPath, MPConfiguration, isSP } = options;

  if (isSP || !MPConfiguration) {
    return configRootPath;
  }

  return MPConfiguration.configRootPathOfPlatfrom;
}

export function createEntryValueIntent(options: CreateEntryValueIntentOptions): string {
  const { entry } = options;
  return entry;
}

export function createHtmlPageIntent(options: CreateHtmlPageIntentOptions): {
  chunks: string[];
  filename: string;
  title: string;
  template: string;
  inject: true;
  hash: true;
  isDev: boolean;
} {
  const { chunkName, title, template, templateRootPath, isDev } = options;

  return {
    chunks: [chunkName],
    filename: `${chunkName}.html`,
    title,
    template: join(templateRootPath, template),
    inject: true,
    hash: true,
    isDev,
  };
}
