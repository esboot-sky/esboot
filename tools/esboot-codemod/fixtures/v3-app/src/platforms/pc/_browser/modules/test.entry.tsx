import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/main.scss';

export const title = 'Fixture Page';

function App() {
  return <div>Hello V4 Upgrade!</div>;
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
