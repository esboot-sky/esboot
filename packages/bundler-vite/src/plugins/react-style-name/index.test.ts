import { describe, expect, it } from 'vitest';
import reactStyleNamePlugin from './index';

function transform(source: string) {
  const [plugin] = reactStyleNamePlugin();
  const result = plugin.transform?.call({} as any, source, '/src/app.tsx') as any;

  return typeof result === 'string' ? result : result?.code;
}

function createResolveContext(resolvedId = '/src/app.scss') {
  return {
    resolve: async () => ({ id: resolvedId }),
  };
}

describe('react-style-name vite plugin', () => {
  it('transforms JSX styleName into a className lookup before JSX compilation', () => {
    const code = transform(`
      import styles from './app.scss';

      export function App() {
        return <div styleName="text2-cls">module css233</div>;
      }
    `);

    expect(code).toContain('className={__styleName([styles], "text2-cls")}');
    expect(code).not.toContain('styleName="text2-cls"');
  });

  it('merges JSX styleName with an existing className', () => {
    const code = transform(`
      import styles from './app.scss';

      export function App() {
        return <div className="page" styleName="text2-cls" />;
      }
    `);

    expect(code).toContain('className={__styleName([styles], "text2-cls", "page")}');
    expect(code).not.toContain('styleName="text2-cls"');
  });

  it('keeps expression styleName values lazy so runtime helpers like clsx still work', () => {
    const code = transform(`
      import './app.scss';

      export function App() {
        return <p styleName={clsx({ test: true })}>ok</p>;
      }
    `);

    expect(code).toContain('import __cls_');
    expect(code).toContain('className={__styleName([__cls_');
    expect(code).toContain('clsx({ test: true })');
    expect(code).not.toContain('styleName={clsx');
  });

  it('does not transform JSX but still resolves scss as a module when useStyleName is false', async () => {
    const [plugin] = reactStyleNamePlugin({ useStyleName: false });

    const code = plugin.transform?.call({} as any, `
      import styles from './app.scss';

      export function App() {
        return <div styleName="text2-cls">module css233</div>;
      }
    `, '/src/app.tsx') as any;

    const resolvedId = await plugin.resolveId?.call(
      createResolveContext() as any,
      './app.scss',
      '/src/app.tsx',
      {},
    );

    expect(code).toBeUndefined();
    expect(resolvedId).toBe('/src/app.scss?module');
  });
});
