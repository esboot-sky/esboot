import { describe, expect, it, vi } from 'vitest';

import esbootJsoncPlugin from './esboot-jsonc';

function createContext() {
  return {
    report: vi.fn(),
    sourceCode: {
      ast: {
        type: 'JSONObjectExpression',
        properties: [],
      },
    },
  };
}

describe('esbootJsoncPlugin', () => {
  it('reports chinese keys in nested object properties', () => {
    const context = createContext();
    const rule = esbootJsoncPlugin.rules['no-chinese-key'];
    const visitors = rule.create(context as any);

    visitors.JSONObjectExpression({
      type: 'JSONObjectExpression',
      properties: [
        {
          type: 'JSONProperty',
          key: {
            type: 'JSONStringLiteral',
            value: '标题',
          },
          value: {
            type: 'JSONObjectExpression',
            properties: [
              {
                type: 'JSONProperty',
                key: {
                  type: 'JSONStringLiteral',
                  value: 'child_name',
                },
                value: {
                  type: 'Literal',
                  value: 'ok',
                },
              },
            ],
          },
        },
      ],
    });

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'noChineseKey',
      data: { key: '标题' },
    }));
  });

  it('does not report ascii-only keys', () => {
    const context = createContext();
    const rule = esbootJsoncPlugin.rules['no-chinese-key'];
    const visitors = rule.create(context as any);

    visitors.JSONObjectExpression({
      type: 'JSONObjectExpression',
      properties: [
        {
          type: 'JSONProperty',
          key: {
            type: 'JSONStringLiteral',
            value: 'page_title',
          },
          value: {
            type: 'Literal',
            value: 'ok',
          },
        },
      ],
    });

    expect(context.report).not.toHaveBeenCalled();
  });
});
