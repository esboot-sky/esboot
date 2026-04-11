import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  createResolvePath: () => (name: string) => `/resolved/${name}`,
}));

describe('getImportPluginsOfRsuite', () => {
  it('imports component styles for uppercase rsuite components', async () => {
    const { getImportPluginsOfRsuite } = await import('./babel-import-plugin');

    const [pluginPath, options] = getImportPluginsOfRsuite();

    expect(pluginPath).toBe('/resolved/babel-plugin-import');
    expect(options.style('rsuite/Button')).toBe('rsuite/Button/styles/index.css');
  });

  it('skips styles for hook-like imports and custom no-css components', async () => {
    const { getImportPluginsOfRsuite } = await import('./babel-import-plugin');

    const [, options] = getImportPluginsOfRsuite(['Button']);

    expect(options.style('rsuite/useFormValue')).toBe(false);
    expect(options.style('rsuite/Button')).toBe(false);
    expect(options.style('rsuite/useToaster')).toBe('rsuite/useToaster/styles/index.css');
  });
});
