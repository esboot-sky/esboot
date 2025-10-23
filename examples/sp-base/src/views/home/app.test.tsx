import { ErrorBoundary } from '@dz-web/esboot-browser-react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { expect, it } from 'vitest';

import App from './app';

it('demo', () => {
  const { container } = render(<ErrorBoundary><App /></ErrorBoundary>, { wrapper: MemoryRouter as any });

  expect(container.querySelector('p')?.textContent).toBe('close');
});
