import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import type { Root, Result, Node } from 'postcss';

const fileCache = new Map();

function calculateContentHash(content: string) {
  try {
    return crypto.createHash('md5').update(content, 'utf8').digest('hex');
  } catch (error) {
    return null;
  }
}

export default async (opts = { useTailwindcss: true }) => {
  const { useTailwindcss } = opts;
  let tailwindCssContent: string;
  let tailwindCssPath: string;
  let postcss: typeof import('postcss');

  if (useTailwindcss) {
    tailwindCssPath = fileURLToPath(
      import.meta.resolve('tailwindcss/index.css')
    );
    
    tailwindCssContent = fs.readFileSync(tailwindCssPath, 'utf8');
    postcss = await import('postcss');
  }

  return {
    postcssPlugin: 'postcss-plugin-esboot',

    Once(root: Root, { result }: { result: Result }) {
      if (useTailwindcss && tailwindCssContent) {
        try {
          const cssContent = root.toString();
          const filePath = result.opts.from;

          const isEntryFile = cssContent.startsWith(
            '/* ESBOOT_SIGN_TAILWIND_CSS */'
          );

          if (isEntryFile && filePath) {
            const currentHash = calculateContentHash(cssContent);

            if (currentHash) {
              const cachedData = fileCache.get(filePath);
              if (cachedData && cachedData.hash === currentHash) {
                try {
                  root.removeAll();
                  cachedData.processedRoot.each((node: Node) => {
                    root.append(node.clone());
                  });

                  return root;
                } catch (cacheError) {
                  fileCache.delete(filePath);
                }
              }
            }
          }

          const commentRegex = /\/\*\s*ESBOOT_SIGN_TAILWIND_CSS\s*\*\//g;

          if (cssContent.startsWith('/* ESBOOT_SIGN_TAILWIND_CSS */')) {
            const updatedCssContent = cssContent.replace(
              commentRegex,
              tailwindCssContent
            );

            const newRoot = postcss.parse(updatedCssContent, {
              from: tailwindCssPath,
            });

            root.removeAll();
            newRoot.each((node) => {
              root.append(node.clone());
            });

            if (isEntryFile && filePath) {
              const currentHash = calculateContentHash(cssContent);
              if (currentHash) {
                try {
                  fileCache.set(filePath, {
                    hash: currentHash,
                    processedRoot: root.clone(),
                  });
                } catch (cacheError: unknown) {
                  console.warn(
                    '⚠️ Update esboot cache failed:',
                    (cacheError as Error).message
                  );
                }
              }
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error('❌ Process Tailwind CSS failed:', errorMessage);
        }
      }

      return root;
    },
  };
};

export const postcss = true;
