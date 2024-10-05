import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import App from './app';

test('Demo', () => {
  const { container } = render(<App />);

  expect(container.querySelector('p')?.textContent).toBe('close');
});
