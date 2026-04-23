import { describe, expect, it, vi } from 'vitest';

const tailwind3Plugin = vi.fn(() => 'tailwind-3');
const tailwindPostcssPlugin = vi.fn(() => ({
  postcssPlugin: '@tailwindcss/postcss',
  Once() {},
}));

vi.mock('./resolve-from-current-package', () => ({
  importModuleFromCurrentPackage: vi.fn(async (moduleName: string) => {
    expect(moduleName).toBe('@tailwindcss/postcss');

    return { default: tailwindPostcssPlugin };
  }),
}));

const importModuleFromPackage = vi.fn(async (moduleName: string, packageName: string) => {
  expect(packageName).toBe('@dz-web/esboot-plugin-tailwind3');

  if (moduleName === 'tailwindcss') {
    return { default: tailwind3Plugin };
  }

  if (moduleName === '@dz-web/esboot-plugin-tailwind3') {
    return {
      tailwind3Config: {
        darkMode: ['selector', '.dz-theme-dark'],
        content: ['./src/**/*.{js,jsx,ts,tsx}'],
        theme: {
          extend: {},
        },
        plugins: [],
      },
    };
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
    expect(tailwind3Plugin).not.toHaveBeenCalled();
  });

  it('uses @tailwindcss/postcss for next', async () => {
    const { addPostcssPluginTailwindcss } = await import('./add-plugin-tailwindcss');

    const plugin = await addPostcssPluginTailwindcss({
      config: {
        css: {
          tailwind: {
            enable: true,
            version: 'next',
          },
        },
      },
    } as any);

    expect(plugin).toEqual(expect.objectContaining({
      postcssPlugin: '@tailwindcss/postcss',
    }));
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
    expect(tailwind3Plugin).toHaveBeenCalledWith(expect.objectContaining({
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      darkMode: ['selector', '.dz-theme-dark'],
      plugins: [],
    }));
    expect(importModuleFromPackage).toHaveBeenCalledWith('tailwindcss', '@dz-web/esboot-plugin-tailwind3', expect.any(String));
    expect(importModuleFromPackage).toHaveBeenCalledWith('@dz-web/esboot-plugin-tailwind3', '@dz-web/esboot-plugin-tailwind3', expect.any(String));
  });

  it('passes a contentful config to tailwindcss for version 3', async () => {
    const { addPostcssPluginTailwindcss } = await import('./add-plugin-tailwindcss');

    await addPostcssPluginTailwindcss({
      config: {
        css: {
          tailwind: {
            enable: true,
            version: '3',
            separateImports: false,
          },
        },
      },
    } as any);

    expect(tailwind3Plugin).toHaveBeenCalledWith(expect.objectContaining({
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      darkMode: ['selector', '.dz-theme-dark'],
      plugins: [],
    }));
  });
});
