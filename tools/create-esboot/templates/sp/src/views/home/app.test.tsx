import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './app';

test('Demo', () => {
  const { container } = render(<App />, { wrapper: MemoryRouter });

  expect(container.querySelector('p')?.textContent).toBe('close');
});
