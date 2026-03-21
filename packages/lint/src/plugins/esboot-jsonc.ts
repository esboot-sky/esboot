import type { Rule } from 'eslint';

const noChineseKeyRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disable JSON key containing Chinese characters',
    },
    messages: {
      noChineseKey: 'JSON key "{{key}}" cannot contain Chinese characters',
    },
  },
  create(context) {
    function checkKey(keyNode: any): void {
      let key: string | undefined;
      if (keyNode.type === 'JSONStringLiteral') {
        key = keyNode.value;
      }
      else if (keyNode.type === 'Literal' && typeof keyNode.value === 'string') {
        key = keyNode.value;
      }
      else if (keyNode.type === 'Identifier') {
        key = keyNode.name;
      }
      else if (keyNode.value !== undefined && typeof keyNode.value === 'string') {
        key = keyNode.value;
      }
      else if (keyNode.name !== undefined && typeof keyNode.name === 'string') {
        key = keyNode.name;
      }

      if (typeof key === 'string' && /[\u4E00-\u9FA5]/.test(key)) {
        context.report({
          node: keyNode,
          messageId: 'noChineseKey',
          data: { key },
        });
      }
    }

    function traverse(node: any): void {
      if (!node)
        return;

      if (node.type === 'JSONObjectExpression' || node.type === 'ObjectExpression' || node.type === 'Object') {
        if (node.properties) {
          for (const property of node.properties) {
            if (property.type === 'JSONProperty' || property.type === 'Property') {
              if (property.key) {
                checkKey(property.key);
              }
              if (property.value) {
                traverse(property.value);
              }
            }
          }
        }
      }
      else if (node.type === 'JSONArrayExpression' || node.type === 'ArrayExpression') {
        if (node.elements) {
          for (const element of node.elements) {
            traverse(element);
          }
        }
      }
    }

    return {
      JSONObjectExpression(node: any) {
        traverse(node);
      },
      ObjectExpression(node: any) {
        traverse(node);
      },
      JSONRoot(node: any) {
        if (node.body && node.body.length > 0) {
          traverse(node.body[0]);
        }
      },
      Program(_node: any) {
        const sourceCode = context.sourceCode;
        const ast = sourceCode.ast as any;
        if (ast.type === 'JSONRoot' && ast.body && ast.body.length > 0) {
          traverse(ast.body[0]);
        }
        else if (ast.body && ast.body.length > 0) {
          traverse(ast.body[0]);
        }
        else if (ast.type === 'JSONObjectExpression' || ast.type === 'ObjectExpression') {
          traverse(ast);
        }
      },
    };
  },
};

const esbootJsoncPlugin = {
  meta: {
    name: 'esboot-jsonc',
    version: '1.0.0',
  },
  rules: {
    'no-chinese-key': noChineseKeyRule,
  },
};

export default esbootJsoncPlugin;
