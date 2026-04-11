import { describe, expect, it } from 'vitest';

import {
  createEntryValueIntent,
  createHtmlPageIntent,
  resolveTemplateRootPath,
} from '../entry-intent';

describe('entry/html shared intent helpers', () => {
  it('resolves template root path for sp and mp projects', () => {
    expect(resolveTemplateRootPath({
      configRootPath: '/repo/app/config',
      MPConfiguration: null,
      isSP: true,
    })).toBe('/repo/app/config');

    expect(resolveTemplateRootPath({
      configRootPath: '/repo/app/config',
      MPConfiguration: {
        configRootPathOfPlatfrom: '/repo/app/config/mobile',
      },
      isSP: false,
    })).toBe('/repo/app/config/mobile');
  });

  it('creates layered or plain entry intent based on lang json picker flag', () => {
    expect(createEntryValueIntent({
      chunkName: 'home',
      entry: '/repo/app/src/home.entry.tsx',
      enableLangJsonPicker: true,
    })).toEqual({
      import: '/repo/app/src/home.entry.tsx',
      layer: 'home',
    });

    expect(createEntryValueIntent({
      chunkName: 'home',
      entry: '/repo/app/src/home.entry.tsx',
      enableLangJsonPicker: false,
    })).toBe('/repo/app/src/home.entry.tsx');
  });

  it('creates shared html page intent metadata', () => {
    expect(createHtmlPageIntent({
      chunkName: 'home',
      title: 'Home',
      template: 'template/index.html',
      templateRootPath: '/repo/app/config',
      isDev: false,
    })).toEqual({
      chunks: ['home'],
      filename: 'home.html',
      title: 'Home',
      template: '/repo/app/config/template/index.html',
      inject: true,
      hash: true,
      isDev: false,
    });
  });
});
