import { describe, expect, it } from 'vitest';
import pluginVue from './index';

describe('is a plugin', () => {
  it('should be a function', () => {
    expect(pluginVue).toBeInstanceOf(Function);
  });

  it('should return the correct plugin', () => {
    const plugin = pluginVue();

    expect(plugin).toBeDefined();
    expect(plugin.key).toBe('plugin-vue');
  });
});
