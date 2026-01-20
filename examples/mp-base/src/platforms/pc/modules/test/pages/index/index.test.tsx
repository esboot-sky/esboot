import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, it } from 'vitest';

import Index from './index';

it('index component should render correctly', async () => {
  const { container } = render(<MemoryRouter><Index /></MemoryRouter>);

  const link = container.querySelector('a')!;
  expect(link.style.fontSize).toBe('16px');
  expect(link.getAttribute('href')).toBe('/detail');

  expect(screen.getByText('375 width in 750 design')).toBeDefined();
});
