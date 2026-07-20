import { describe, expect, it } from 'vitest';
import { addBuildCfg } from './add-build-cfg';

describe('Vite addBuildCfg', () => {
  it('should add treeshake.moduleSideEffects configuration to rollupOptions for css/scss/sass/less files', async () => {
    const viteCfg: any = {
      plugins: [],
    };
    const cfg: any = {
      config: {
        sourceMap: false,
        outputPath: 'dist',
        isDev: false,
        minimize: false,
        assetsInlineLimit: 4096,
        bundlerOptions: {},
      },
    };

    await addBuildCfg(cfg, viteCfg);

    expect(viteCfg.build.rollupOptions).toBeDefined();
    expect(viteCfg.build.rollupOptions.treeshake).toBeDefined();
    
    const moduleSideEffects = viteCfg.build.rollupOptions.treeshake.moduleSideEffects;
    expect(moduleSideEffects).toBeTypeOf('function');

    // Test CSS matching
    expect(moduleSideEffects('style.css')).toBe(true);
    expect(moduleSideEffects('style.scss')).toBe(true);
    expect(moduleSideEffects('style.sass')).toBe(true);
    expect(moduleSideEffects('style.less')).toBe(true);
    expect(moduleSideEffects('style.scss?module')).toBe(true);
    expect(moduleSideEffects('style.scss?used')).toBe(true);

    // Test non-CSS matching
    expect(moduleSideEffects('index.js')).toBeUndefined();
    expect(moduleSideEffects('index.tsx')).toBeUndefined();
  });
});
