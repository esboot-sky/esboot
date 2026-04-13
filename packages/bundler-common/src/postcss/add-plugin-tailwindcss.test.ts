import { describe, expect, it, vi } from 'vitest';

const tailwindPostcssPlugin = vi.fn(() => 'tailwind-next');
const tailwind3Plugin = vi.fn(() => 'tailwind-3');

vi.mock('./resolve-from-cwd', () => ({
  importModuleFromCwd: vi.fn(async (moduleName: string) => {
    if (moduleName === 'tailwindcss') {
      return { default: tailwind3Plugin };
    }

    return { default: tailwindPostcssPlugin };
  }),
}));

const importModuleFromPackage = vi.fn(async (moduleName: string, packageName: string) => {
  expect(packageName).toBe('@dz-web/esboot-plugin-tailwind3');

  if (moduleName === 'tailwindcss') {
    return { default: tailwind3Plugin };
  }

  return { default: tailwindPostcssPlugin };
});

vi.mock('./resolve-from-package', () => ({
  importModuleFromPackage,
}));

describe('addPostcssPluginTailwindcss', () => {
  it('returns false when tailwind is disabled', async () => {
    const { addPostcssPluginTailwindcss } = await import('./add-plugin-tailwindcss');

    await expect(addPostcssPluginTailwindcss({
      config: {
        css: {
          tailwind: {
            enable: false,
            version: 'next',
          },
        },
      },
    } as any)).resolves.toBe(false);
    expect(tailwindPostcssPlugin).not.toHaveBeenCalled();
    expect(tailwind3Plugin).not.toHaveBeenCalled();
  });

  it('uses @tailwindcss/postcss for next', async () => {
    const { addPostcssPluginTailwindcss } = await import('./add-plugin-tailwindcss');

    await expect(addPostcssPluginTailwindcss({
      config: {
        css: {
          tailwind: {
            enable: true,
            version: 'next',
          },
        },
      },
    } as any)).resolves.toBe('tailwind-next');
    expect(tailwindPostcssPlugin).toHaveBeenCalledTimes(1);
    expect(tailwind3Plugin).not.toHaveBeenCalled();
  });

  it('uses tailwindcss for version 3', async () => {
    const { addPostcssPluginTailwindcss } = await import('./add-plugin-tailwindcss');

    await expect(addPostcssPluginTailwindcss({
      config: {
        css: {
          tailwind: {
            enable: true,
            version: '3',
          },
        },
      },
    } as any)).resolves.toBe('tailwind-3');
    expect(tailwind3Plugin).toHaveBeenCalledTimes(1);
    expect(importModuleFromPackage).toHaveBeenCalledWith('tailwindcss', '@dz-web/esboot-plugin-tailwind3', expect.any(String));
  });
});
