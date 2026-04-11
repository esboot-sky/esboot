import { describe, expect, it } from 'vitest';

import config from './index.mjs';

describe('stylelint config', () => {
  it('exports expected core shape', () => {
    expect(config.extends).toHaveLength(1);
    expect(config.plugins).toHaveLength(2);
    expect(config.customSyntax).toContain('postcss-scss');
    expect(config.ignoreFiles).toEqual(['!src/**/*', 'node_modules']);
  });

  it('allows esboot-specific pseudo classes and scss at-rules', () => {
    expect(config.rules['selector-pseudo-class-no-unknown']).toEqual([
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ]);

    expect(config.rules['at-rule-no-unknown'][1].ignoreAtRules).toContain('mixin');
    expect(config.rules['at-rule-no-unknown'][1].ignoreAtRules).toContain('use');
  });

  it('enforces stylistic rules important to the project defaults', () => {
    expect(config.rules['import-notation']).toBe('string');
    expect(config.rules['max-nesting-depth']).toBe(2);
    expect(config.rules['@stylistic/string-quotes']).toBe('single');
    expect(config.rules['@stylistic/indentation']).toBe(2);
  });
});
