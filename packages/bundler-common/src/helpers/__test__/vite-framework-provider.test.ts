import { describe, expect, it, vi } from 'vitest';
import {
  resolveViteFrameworkPlugins,
  shouldUseReactStyleNamePlugin,
  transformFrameworkBundles,
} from '../vite-framework-provider';

describe('resolveViteFrameworkPlugins', () => {
  it('returns undefined when no framework provider is configured', async () => {
    await expect(resolveViteFrameworkPlugins(undefined, {
      target: 'vite',
      isDev: true,
    })).resolves.toBeUndefined();
  });

  it('delegates plugin creation to the configured framework provider', async () => {
    const getPlugins = vi.fn(() => ['vue-plugin']);

    await expect(resolveViteFrameworkPlugins({
      frameworkProvider: {
        getPlugins,
      },
    }, {
      target: 'vitest',
      isDev: false,
    })).resolves.toEqual(['vue-plugin']);

    expect(getPlugins).toHaveBeenCalledWith({
      target: 'vitest',
      isDev: false,
    });
  });
});

describe('transformFrameworkBundles', () => {
  it('uses provider bundle transforms when available', () => {
    expect(transformFrameworkBundles({
      frameworkProvider: {
        getPlugins: () => [],
        transformFrameworkBundles: frameworkBundles => ['vue', ...frameworkBundles],
      },
    }, ['lodash-es'])).toEqual(['vue', 'lodash-es']);
  });
});

describe('shouldUseReactStyleNamePlugin', () => {
  it('defaults to true without a framework provider', () => {
    expect(shouldUseReactStyleNamePlugin()).toBe(true);
  });

  it('honors a provider that disables react styleName support', () => {
    expect(shouldUseReactStyleNamePlugin({
      frameworkProvider: {
        getPlugins: () => [],
        useReactStyleNamePlugin: false,
      },
    })).toBe(false);
  });
});
