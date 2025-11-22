import type { AtRule, Node, Root } from 'postcss';
import crypto from 'node:crypto';

export function calculateContentHash(content: string): string | null {
  try {
    return crypto.createHash('md5').update(content, 'utf8').digest('hex');
  }
  catch {
    return null;
  }
}

export function removeLayerNodes(root: Root): void {
  const layersToProcess: Array<{ atRule: AtRule; nodes: Node[] }> = [];

  root.walkAtRules((atRule) => {
    if (atRule.name === 'layer') {
      const innerNodes: Node[] = [];
      if (atRule.nodes && atRule.nodes.length > 0) {
        atRule.nodes.forEach((node) => {
          innerNodes.push(node.clone());
        });
      }
      layersToProcess.push({ atRule, nodes: innerNodes });
    }
  });

  layersToProcess.forEach(({ atRule, nodes }) => {
    if (nodes.length > 0) {
      nodes.forEach((node) => {
        atRule.before(node);
      });
    }
    atRule.remove();
  });
}
