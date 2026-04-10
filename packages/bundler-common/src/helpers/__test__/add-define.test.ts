import { describe, expect, it } from 'vitest';
import { addDefine } from '../add-define';

describe('addDefine', () => {
  it('stringifies string values but keeps booleans and numbers as runtime literals', () => {
    const cfg = {
      config: {
        define: {
          'process.env.NAME': 'esboot',
          'process.env.ENABLED': true,
          'process.env.PORT': 4000,
        },
      },
    };

    expect(addDefine(cfg as any)).toEqual({
      'process.env.NAME': '"esboot"',
      'process.env.ENABLED': true,
      'process.env.PORT': 4000,
    });
  });
});
