import { describe, it, expect } from 'vitest';
import pluginVitest, { alias } from './index';

describe('alias', () => {
  it('should return the correct alias', () => {
    expect(alias).toEqual({
      vitest: expect.any(String),
      '@testing-library/react': expect.any(String),
      '@testing-library/user-event': expect.any(String),
    });
  });
});

describe('Is a plugin', () => {
  it('should be a function', () => {
    expect(pluginVitest).toBeInstanceOf(Function);
  });

  it('should return the correct plugin', () => {
    const plugin = pluginVitest();

    expect(plugin).toBeDefined();
    expect(plugin.key).toBe('plugin-vitest');
    expect(plugin.registerCommands).toBeDefined();
    expect(plugin.registerCommands).toBeInstanceOf(Function);

    expect(plugin.modifyConfig).toBeDefined();
    expect(plugin.modifyConfig).toBeInstanceOf(Function);

    expect(plugin.modifyTypescriptConfig).toBeDefined();
    expect(plugin.modifyTypescriptConfig).toBeInstanceOf(Function);
  });
});
