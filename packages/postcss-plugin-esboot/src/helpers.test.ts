import { parse } from 'postcss';
import { describe, expect, it } from 'vitest';

import { calculateContentHash, removeLayerNodes } from './helpers';

describe('calculateContentHash', () => {
  it('returns a stable md5 hash for the same content', () => {
    expect(calculateContentHash('body{color:red}')).toBe(calculateContentHash('body{color:red}'));
    expect(calculateContentHash('body{color:red}')).not.toBe(calculateContentHash('body{color:blue}'));
  });
});

describe('removeLayerNodes', () => {
  it('unwraps layer blocks and keeps inner nodes in order', () => {
    const root = parse(`
      @layer theme {
        :root { --color: red; }
      }
      @layer utilities {
        .btn { color: blue; }
      }
    `);

    removeLayerNodes(root);

    expect(root.toString()).toContain(':root { --color: red; }');
    expect(root.toString()).toContain('.btn { color: blue; }');
    expect(root.toString()).not.toContain('@layer');
  });
});
