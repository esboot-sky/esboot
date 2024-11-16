import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect } from 'vitest';

import App from './app';

test('Demo', () => {
  const { container } = render(<App />, { wrapper: MemoryRouter });

  expect(container.querySelector('p')?.textContent).toBe('close');
});
