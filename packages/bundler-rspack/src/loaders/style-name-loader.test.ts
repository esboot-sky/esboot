import { describe, expect, it } from 'vitest';
import styleNameLoader from './style-name-loader';

function runLoader(source: string, resourcePath = '/src/views/home/app.tsx') {
  const result = styleNameLoader.call(
    { resourcePath } as any,
    source,
  );
  return result;
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

  it('merges styleName with existing className', () => {
    const result = runLoader(`
      import styles from './app.scss';

      export function App() {
        return <div className="page" styleName="container" />;
      }
    `);

    expect(result).toContain('className={__styleName([styles], "container", "page")}');
  });

  it('does not transform files in the global styles directory', () => {
    const result = runLoader(`
      import './styles/index.scss';

      export function App() {
        return <div styleName="container">hello</div>;
      }
    `);

    // global style imports are skipped by findStyleImports (contains 'styles/')
    // so no variable is generated and styleName is left alone
    expect(result).not.toMatch(/import __cls_/);
  });

  it('returns original source unchanged when there are no scss imports', () => {
    const source = `
      export function App() {
        return <div className="container">hello</div>;
      }
    `;
    const result = runLoader(source);
    expect(result).toBe(source);
  });

  it('passes through .ts files unchanged', () => {
    const source = `export const x = 1;`;
    const result = styleNameLoader.call(
      { resourcePath: '/src/utils.ts' } as any,
      source,
    );
    expect(result).toBe(source);
  });

  it('handles expression styleName values with clsx', () => {
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
});
