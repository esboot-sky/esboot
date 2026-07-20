import { describe, expect, it } from 'vitest';
import { addBuildCfg } from './add-build-cfg';

describe('addBuildCfg treeshake configuration', () => {
  it('adds treeshake.moduleSideEffects array with css rule', async () => {
    const viteCfg: any = {
      build: {},
    };

    await addBuildCfg(
      {
        config: {
          isDev: false,
          minimize: false,
        },
      } as any,
      viteCfg
    );

    expect(viteCfg.build.rollupOptions.treeshake).toEqual({
      moduleSideEffects: [
        {
          test: /\.(css|scss|sass|less)(\?.*)?$/,
          sideEffects: true,
        },
      ],
    });
  });
});
