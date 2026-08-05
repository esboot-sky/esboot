import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import App from './app';

it('demo', () => {
  const { container } = render(<App />);

  expect(container.querySelector('p')?.textContent).toBe('close');
});
