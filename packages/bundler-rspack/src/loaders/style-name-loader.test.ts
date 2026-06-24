import { describe, expect, it } from 'vitest';

import styleNameLoader from './style-name-loader';

function runLoader(source: string, resourcePath = '/src/views/home/app.tsx') {
  return styleNameLoader.call(
    { resourcePath } as any,
    source,
  );
}

describe('styleNameLoader', () => {
  it('rewrites side-effect scss import to a named import and transforms styleName', () => {
    const result = runLoader(`
      import './app.scss';

      export function App() {
        return <div styleName="container">hello</div>;
      }
    `);

    expect(result).toMatch(/import __cls_\d+ from '\.\/app\.scss';/);
    expect(result).toMatch(/className=\{__styleName\(\[__cls_\d+\], "container"\)\}/);
    expect(result).not.toContain('styleName="container"');
  });

  it('transforms named scss import and styleName', () => {
    const result = runLoader(`
      import styles from './app.scss';

      export function App() {
        return <div styleName="container">hello</div>;
      }
    `);

    expect(result).toContain('className={__styleName([styles], "container")}');
    expect(result).not.toContain('styleName="container"');
  });

  it('merges styleName with an existing className expression', () => {
    const result = runLoader(`
      import styles from './app.scss';

      export function App({ active }) {
        return <div className={active ? 'page active' : 'page'} styleName="container" />;
      }
    `);

    expect(result).toContain(`className={__styleName([styles], "container", active ? 'page active' : 'page')}`);
    expect(result).not.toContain('styleName="container"');
  });

  it('keeps expression styleName values lazy so runtime helpers like clsx still work', () => {
    const result = runLoader(`
      import './app.scss';

      export function App() {
        return <p styleName={clsx({ test: true })}>ok</p>;
      }
    `);

    expect(result).toMatch(/import __cls_\d+ from '\.\/app\.scss';/);
    expect(result).toMatch(/className=\{__styleName\(\[__cls_\d+\], clsx\(\{ test: true \}\)\)\}/);
    expect(result).not.toContain('styleName={clsx');
  });

  it('collects multiple scss module imports for a single styleName lookup', () => {
    const result = runLoader(`
      import page from './page.scss';
      import state from './state.scss';

      export function App() {
        return <div styleName="container is-active">hello</div>;
      }
    `);

    expect(result).toContain('className={__styleName([page,state], "container is-active")}');
  });

  it('does not transform files in the global styles directory', () => {
    const result = runLoader(`
      import './styles/index.scss';

      export function App() {
        return <div styleName="container">hello</div>;
      }
    `);

    expect(result).not.toMatch(/import __cls_/);
  });

  it('returns original source unchanged when there are no scss imports', () => {
    const source = `
      export function App() {
        return <div className="container">hello</div>;
      }
    `;

    expect(runLoader(source)).toBe(source);
  });

  it('passes through .ts files unchanged', () => {
    const source = `export const x = 1;`;
    const result = styleNameLoader.call(
      { resourcePath: '/src/utils.ts' } as any,
      source,
    );

    expect(result).toBe(source);
  });
});
