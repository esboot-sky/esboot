import { describe, expect, it } from 'vitest';

import {
  createOutputIntent,
  resolveDevtoolIntent,
  resolveExternalsIntent,
} from '../bundler-intent';

describe('bundler shared intent helpers', () => {
  it('creates output intent for development and production', () => {
    expect(createOutputIntent({
      cwd: '/repo/app',
      isDev: true,
      publicPath: '/',
      outputPath: 'dist',
    })).toEqual({
      publicPath: '/',
      clean: false,
      path: '/repo/app/dist',
      filename: 'js/[name].js',
    });

    expect(createOutputIntent({
      cwd: '/repo/app',
      isDev: false,
      publicPath: '/static/',
      outputPath: 'build',
    })).toEqual({
      publicPath: '/static/',
      clean: true,
      path: '/repo/app/build',
      filename: 'js/[name].[chunkhash:8].js',
    });
  });

  it('resolves devtool intent from sourceMap and isDev flags', () => {
    expect(resolveDevtoolIntent({ isDev: true, sourceMap: false })).toBe('cheap-module-source-map');
    expect(resolveDevtoolIntent({ isDev: false, sourceMap: true })).toBe('source-map');
    expect(resolveDevtoolIntent({ isDev: false, sourceMap: false })).toBeUndefined();
  });

  it('returns externals only when provided', () => {
    expect(resolveExternalsIntent({ react: 'React' })).toEqual({ react: 'React' });
    expect(resolveExternalsIntent(undefined)).toBeUndefined();
  });
});
