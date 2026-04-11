import { useState } from 'react';

import './index.scss';

export default function SSGDemoPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="ssg-demo-page">
      <section className="ssg-demo-page-card">
        <p className="ssg-demo-page-eyebrow">ESBoot Vite SSG Demo</p>
        <h1 className="ssg-demo-page-title">This page is prerendered at build time and hydrated on the client.</h1>
        <p className="ssg-demo-page-desc">
          The first screen comes from build-time HTML, then React hydrates the page so the button below
          becomes interactive without losing the prerendered markup.
        </p>
        <ul className="ssg-demo-page-list">
          <li>Build-time HTML injection into the final template</li>
          <li>No runtime route fetch is required for the first paint</li>
          <li>Hydration keeps the initial markup and restores client interaction</li>
        </ul>
        <div className="ssg-demo-page-actions">
          <button
            className="ssg-demo-page-button"
            type="button"
            onClick={() => setCount(current => current + 1)}
          >
            hydrate counter
            <span className="ssg-demo-page-count">{count}</span>
          </button>
        </div>
      </section>
    </main>
  );
}
