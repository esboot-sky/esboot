import { describe, expect, it, vi } from 'vitest';

const postcssPluginESBoot = vi.fn(() => 'postcss-esboot');

vi.mock('@dz-web/postcss-plugin-esboot', () => ({
  default: postcssPluginESBoot,
}));

describe('addPostcssPluginESBoot', () => {
  it('passes css tailwind config through to postcss-plugin-esboot', async () => {
    const { addPostcssPluginESBoot } = await import('./add-plugin-esboot');

    await expect(addPostcssPluginESBoot({
      config: {
        css: {
          tailwind: {
            enable: true,
            version: '3',
            separateImports: true,
          },
        },
        isDev: false,
      },
    } as any)).resolves.toBe('postcss-esboot');

    expect(postcssPluginESBoot).toHaveBeenCalledWith({
      useTailwindcss: true,
      useSeparateTailwindImports: true,
      isDev: false,
      tailwindVersion: '3',
    });
  });
});
