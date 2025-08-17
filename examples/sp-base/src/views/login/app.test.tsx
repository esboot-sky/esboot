import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import App from './app';

it('demo', () => {
  const { container } = render(<App />, { wrapper: MemoryRouter });

  expect(container.querySelector('p')?.textContent).toBe('close');
});
