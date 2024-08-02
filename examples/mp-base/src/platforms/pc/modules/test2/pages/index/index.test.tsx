import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';

import Index from './index';

test('Index component should render correctly', async () => {
  const { container } = render(<MemoryRouter><Index /></MemoryRouter>);

  const link = container.querySelector('a')!;
  expect(link).toHaveStyle({ fontSize: '16px' });
  expect(link.getAttribute('href')).toBe('/detail');

  expect(screen.getByText('375 width in 750 design')).toBeInTheDocument();
});
