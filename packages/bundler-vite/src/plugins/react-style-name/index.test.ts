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
  it('resolves non-global scss imports as CSS Modules', async () => {
    const [plugin] = reactStyleNamePlugin({ rootPath: '/project/src', isSP: true });

    const resolvedId = await plugin.resolveId?.call(
      createResolveContext('/project/src/views/home/app.scss') as any,
      './app.scss',
      '/project/src/views/home/app.tsx',
      {},
    );

    expect(resolvedId).toBe('/project/src/views/home/app.scss?module');
  });

  it('appends module with an ampersand when the resolved scss id already has a query', async () => {
    const [plugin] = reactStyleNamePlugin({ rootPath: '/project/src', isSP: true });

    const resolvedId = await plugin.resolveId?.call(
      createResolveContext('/project/src/views/home/app.scss?used') as any,
      './app.scss',
      '/project/src/views/home/app.tsx',
      {},
    );

    expect(resolvedId).toBe('/project/src/views/home/app.scss?used&module');
  });

  it('does not force global scss files into CSS Modules', async () => {
    const [plugin] = reactStyleNamePlugin({ rootPath: '/project/src', isSP: true });

    const resolvedId = await plugin.resolveId?.call(
      createResolveContext('/project/src/styles/index.scss') as any,
      '@/styles/index.scss',
      '/project/src/index.entry.tsx',
      {},
    );

    expect(resolvedId).toBeNull();
  });

  it('does not force windows global scss files into CSS Modules', async () => {
    const [plugin] = reactStyleNamePlugin({ rootPath: 'C:\\project\\src', isSP: true });

    const resolvedId = await plugin.resolveId?.call(
      createResolveContext('C:\\project\\src\\styles\\index.scss') as any,
      '@/styles/index.scss',
      'C:\\project\\src\\index.entry.tsx',
      {},
    );

    expect(resolvedId).toBeNull();
  });

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

  it('keeps existing className expressions when merging styleName', () => {
    const code = transform(`
      import styles from './app.scss';

      export function App({ active }) {
        return <div className={active ? 'page active' : 'page'} styleName="text2-cls" />;
      }
    `);

    expect(code).toContain(`className={__styleName([styles], "text2-cls", active ? 'page active' : 'page')}`);
    expect(code).not.toContain('styleName="text2-cls"');
  });

  it('passes multiple styleName tokens to the runtime helper unchanged', () => {
    const code = transform(`
      import styles from './app.scss';

      export function App() {
        return <div styleName="text text2-cls" />;
      }
    `);

    expect(code).toContain('className={__styleName([styles], "text text2-cls")}');
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

  it('converts side-effect scss imports into generated CSS Module imports', () => {
    const code = transform(`
      import './app.scss';

      export function App() {
        return <div styleName="text2-cls" />;
      }
    `);

    expect(code).toMatch(/import __cls_\d+ from '\.\/app\.scss';/);
    expect(code).toMatch(/className=\{__styleName\(\[__cls_\d+\], "text2-cls"\)\}/);
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
