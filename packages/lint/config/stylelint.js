module.exports = {
  extends: [require.resolve('stylelint-config-standard')],
  plugins: [
    require.resolve('stylelint-scss'),
    require.resolve('stylelint-declaration-use-variable'),
  ],
  customSyntax: require.resolve('postcss-scss'),
  ignoreFiles: ['!src/**/*', 'node_modules'],
  rules: {
    'import-notation': 'string',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function',
          'use',
          'tailwind',
        ],
      },
    ],
    'scss/dollar-variable-pattern': '^(([a-z]+)-*)+$',
    "selector-max-id": [
      1,
      {
        "ignoreContextFunctionalPseudoClasses": [
          ":not",
          "/^:(h|H)as$/"
        ]
      }
    ],
    "selector-id-pattern": "^root$",
    'max-nesting-depth': 3,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'color-function-notation': 'legacy',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-no-empty': true,
    'comment-whitespace-inside': 'always',
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-name-case': 'lower',
    'keyframe-declaration-no-important': true,
    'length-zero-no-unit': true,
    'media-feature-name-no-unknown': true,
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local'] },
    ],
    'selector-pseudo-element-colon-notation': 'single',
    'selector-pseudo-element-no-unknown': true,
    'selector-type-case': 'lower',
    'selector-type-no-unknown': true,
    'shorthand-property-no-redundant-values': true,
    'string-no-newline': true,
    'unit-no-unknown': true,
    'no-eol-whitespace': true,
    'block-no-empty': true,
    'no-empty-first-line': true,
    'no-empty-source': true,
    'no-missing-end-of-source-newline': true,
    'max-empty-lines': 1,
  },
};
